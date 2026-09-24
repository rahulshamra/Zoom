import { io } from "socket.io-client";

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const socket = io(url, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
