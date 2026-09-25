import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";

import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/user.js";

dotenv.config();

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/users",userRoutes);

const server = createServer(app); // HTTP server banaya
const io = connectToSocket(server); // Socket.IO ko server se connect kiya
 
//connect db
const connectdb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("✅ MongoDB Connected");
        server.listen(8000, () => {
            console.log("Server is running on port 8000");
        });
    } catch (err) {
        console.log("❌ MongoDB Error:", err);
        process.exit(1);
    }
}
//

app.get("/", async (req, res) => {
    res.send("hey");
});

connectdb();


