import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectToSocket from "./controllers/socketManager.js";
import cors from "cors";
import { User } from "./models/userSchema.js";
import userRoutes from "./routes/user.js";
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));// url encoded data read
app.use(cors());
app.use("/users",userRoutes);

const server = createServer(app); // HTTP server banaya
const io = connectToSocket(server); // Socket.IO ko server se connect kiya
 
app.get("/users",async(req,res)=>{
  const re=await User.find({});
  res.send("all users are fetch well done");
})
//connect db
const connectdb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.log("❌ MongoDB Error:", err);
    }
}
//

app.get("/", async (req, res) => {
    res.send("hey");
});

server.listen(8000, () => {
    console.log("Server is running on port 8000");
});

// connectdb();


