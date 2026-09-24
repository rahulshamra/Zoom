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
<<<<<<< HEAD
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
=======
app.use(express.urlencoded({ extended: true }));// url encoded data read
app.use(cors());
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
app.use("/users",userRoutes);

const server = createServer(app); // HTTP server banaya
const io = connectToSocket(server); // Socket.IO ko server se connect kiya
 
<<<<<<< HEAD
=======
app.get("/users",async(req,res)=>{
  const re=await User.find({});
  res.send("all users are fetch well done");
})
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
//connect db
const connectdb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("✅ MongoDB Connected");
<<<<<<< HEAD
        server.listen(8000, () => {
            console.log("Server is running on port 8000");
        });
    } catch (err) {
        console.log("❌ MongoDB Error:", err);
        process.exit(1);
=======
    } catch (err) {
        console.log("❌ MongoDB Error:", err);
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
    }
}
//

app.get("/", async (req, res) => {
    res.send("hey");
});

<<<<<<< HEAD
connectdb();
=======
server.listen(8000, () => {
    console.log("Server is running on port 8000");
});

// connectdb();
>>>>>>> f66c690a54900e11880652f86544e383c21efd86


