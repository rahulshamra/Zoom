import { Server } from "socket.io";
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