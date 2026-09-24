import { io } from "socket.io-client";

<<<<<<< HEAD
const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

console.log("Backend URL:", url);

const socket = io(url, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
=======
const socket = io("http://localhost:8000", {
  autoConnect: true,
});

export default socket;
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
