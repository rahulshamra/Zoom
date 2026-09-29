import { Server } from "socket.io";
import { User } from "../models/userSchema.js";
import { Meeting } from "../models/mettingSchema.js";
import jwt from "jsonwebtoken";
import { getTokenFromCookie } from "../middleware/auth.js";

const connectToSocket = (server) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean);

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    try {
      const token = getTokenFromCookie(socket.handshake.headers.cookie);
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      socket.username = socket.user.username;
      socket.meetingId = socket.handshake.auth?.meetingId;

      const meeting = await Meeting.findOne({
        _id: socket.meetingId,
      });
      const hasAccess = await User.exists({ _id: socket.user.id, meetings: socket.meetingId });
      if (!meeting || !hasAccess) {
        socket.disconnect(true);
        return;
      }

      const meetingRoom = socket.meetingId.toString();
      await socket.join(meetingRoom);

      const emitOnlineCount = async () => {
        const roomSockets = await io.in(meetingRoom).fetchSockets();
        io.to(meetingRoom).emit("online users", roomSockets.length);
      };

      io.to(meetingRoom).emit("user joined", {
        username: socket.username,
        message: "Connected",
      });
      await emitOnlineCount();

      socket.on("chat message", async (data, acknowledge) => {
        const message = data?.message?.trim();
        if (!message) return;

        const chatMessage = {
          username: socket.username,
          message,
        };

        socket.to(meetingRoom).emit("chat message", chatMessage);
        acknowledge?.({ ok: true, message: chatMessage });

        try {
          await Meeting.findByIdAndUpdate(socket.meetingId, {
            $push: {
              chatHistory: {
                ...chatMessage,
                time: new Date(),
              },
            },
          });
        } catch (error) {
          console.error("Unable to save meeting chat message:", error);
        }
      });

      socket.on("disconnect", async () => {
        io.to(meetingRoom).emit("user left", {
          username: socket.username,
          message: "Left",
        });
        await emitOnlineCount();
      });

      socket.on("message", (data) => {
        socket.to(meetingRoom).emit("message", data);
      });
    } catch {
      socket.disconnect(true);
    }
  });

  return io;
};

export default connectToSocket;
