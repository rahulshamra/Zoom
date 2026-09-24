import { Server } from "socket.io";
<<<<<<< HEAD
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
=======
import cors from "cors"
const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  const connectedUsers = new Set();
  // const  users=  new Set ();

  io.on('connection', (socket) => {
    console.log(socket.id);
    //    console.log(connectedUsers.length);
    console.log(connectedUsers.size);
    // Handle new messages
    socket.on('chat message', (data) => {
      console.log('Message received:', data.message);
      // console.log(socket.id);
      // console.log(data.username);
      // Broadcast the message to all connected clients
      socket.broadcast.emit("chat message", data);
    });
    // handel setusername





    socket.on('set username', (username) => {
      connectedUsers.add(username);
      io.emit("online users", connectedUsers.size);
      console.log(connectedUsers);
      // console.log(users);
      // console.log( io.engine.clientsCount);
      socket.username = username;
      io.emit('user joined', {
        username: socket.username,
        message: "Connected"
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      connectedUsers.delete(socket.username);
      io.emit("online users", connectedUsers.size);
      console.log(`${socket.username} disconnected`);
      socket.broadcast.emit("user left", {
        username: socket.username,
        message: "Left"
      });
    });

    //count users
    // video call events
    socket.on('message', (data) => {
      // console.log('Message received:', data.type);
      // console.log(data);
      socket.broadcast.emit('message', data);
    });
  });
  return io;
}

export default connectToSocket;
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
