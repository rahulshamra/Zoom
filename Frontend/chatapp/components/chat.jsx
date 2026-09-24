import { useState, useEffect, useRef } from "react";
import socket from "../src/socket";
import Video from "./video";
import { FiSend, FiLogOut, FiUsers } from "react-icons/fi";

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function Chat({ username, meeting, onLeaveRoom }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, SetonlineUsers] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState("");
=======
function Chat({ username, setUsername }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, SetonlineUsers] = useState(0);
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
<<<<<<< HEAD
    let active = true;
    socket.auth = { meetingId: meeting.meetingId || meeting._id };

    const receiveData = (data) => {
      setMessages((prev) => [...prev, data]);
    };
     
    const connectedUsers = (count) => {
      SetonlineUsers(count);
    };
    const handleConnect = () => {
      setSocketConnected(true);
      setSocketError("");
    };
    const handleDisconnect = () => setSocketConnected(false);
    const handleConnectError = () => {
      setSocketConnected(false);
      setSocketError("Room connection failed. Please re-enter the meeting.");
    };
=======
    const receiveData = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const connectedUsers = (count) => {
      SetonlineUsers(count);
    };
>>>>>>> f66c690a54900e11880652f86544e383c21efd86

    socket.on("chat message", receiveData);
    socket.on("user joined", receiveData); 
    socket.on("user left", receiveData);
    socket.on("online users", connectedUsers);
<<<<<<< HEAD
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    const historyRequest = fetch(`${API_URL}/users/meetings/${meeting.meetingId || meeting._id}/chat-history`, { credentials: "include" })
      .then((response) => response.ok ? response.json() : { chatHistory: [] })
      .then((result) => { if (active) setMessages(result.chatHistory || []); })
      .catch((error) => console.error("Unable to load chat history:", error));

    historyRequest.finally(() => {
      if (active) socket.connect();
    });

    return () => {
      active = false;
=======

    return () => {
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
      socket.off("chat message", receiveData);
      socket.off("user joined", receiveData);
      socket.off("user left", receiveData);
      socket.off("online users", connectedUsers);
<<<<<<< HEAD
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [username, meeting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket.connected) {
      setSocketError("Waiting for the room connection...");
      return;
    }
=======
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
>>>>>>> f66c690a54900e11880652f86544e383c21efd86

    const data = {
      username: username,
      message: message
    };

    setMessages((prevmessages) => [...prevmessages, data]);
<<<<<<< HEAD
    socket.emit("chat message", data, (result) => {
      if (!result?.ok) setSocketError("Message was not delivered.");
    });
=======
    socket.emit("chat message", data);
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
    setMessage("");
  };

  const handleDisconnect = () => {
    socket.disconnect();
    setMessages([]);
<<<<<<< HEAD
    onLeaveRoom();
  };

  return (
    <main className="room-page">
      <header className="room-nav">
        <div className="brand-mark"><span className="brand-symbol">z</span><span>zoomly</span></div>
        <div className="room-nav-meta"><span className="room-status-dot" /> Private room <span className="room-user">{username}</span></div>
      </header>
      <div className="room-heading">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> Your live space</p><h1>Stay in the <em>room.</em></h1></div>
        <p>Talk freely, keep the thread.</p>
      </div>
=======
    setUsername("");
  };

  return (
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
    <div className="app-workspace">
      
      {/* Left Workspace: Fits dynamically without overflow */}
      <div className="video-workspace-pane">
        <Video username={username} />
      </div>

      {/* Right Sidebar Area */}
      <div className="chat-workspace-pane">
        
        {/* Header Metadata */}
        <div className="pane-header">
          <div className="room-meta">
<<<<<<< HEAD
            <h3>{meeting.meetingName}</h3>
            <div className="live-counter">
              <FiUsers size={14} />
              <span>{socketConnected ? `${onlineUsers} Active` : "Connecting..."}</span>
=======
            <h3>Live Streaming Room</h3>
            <div className="live-counter">
              <FiUsers size={14} />
              <span>{onlineUsers} Active</span>
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
            </div>
          </div>
          <button onClick={handleDisconnect} className="exit-btn">
            <FiLogOut size={16} />
            <span>Leave</span>
          </button>
        </div>

        {/* Dynamic List Scroller - ONLY container allowed to vertical-scroll */}
        <div className="messages-scroller">
          {messages.map((msg, index) => {
            if (!msg.username && !msg.message) return null;

            // System Notification: User Connected (GREEN text background alert)
            if (msg.message === "Connected" ) {
              return (
                <div key={index} className="system-banner join">
                  <span>● {msg.username || "New user"} connected</span>
                </div>
              );
            }
            
            // System Notification: User Disconnected (RED text background alert)
           else if (msg.message === "Left" ) {
              return (
                <div key={index} className="system-banner leave">
                  <span>● {msg.username || "A user"} disconnected</span>
                </div>
              );
            }

            // Standard message formatting
            const isSelf = msg.username === username;
            return (
              <div key={index} className={`msg-row-wrapper ${isSelf ? "outgoing" : "incoming"}`}>
                <div className="bubble-wrapper">
                  <div className="chat-bubble">
                    {/* Username and message completely nested in a single custom container bubble block */}
                    <span className="bubble-author">{isSelf ? "You" : msg.username}</span>
                    <p className="bubble-text">{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
<<<<<<< HEAD
        {socketError && <p className="room-error">{socketError}</p>}
=======
>>>>>>> f66c690a54900e11880652f86544e383c21efd86

        {/* Message Input Box Block */}
        <form onSubmit={handleSubmit} className="pane-input-footer">
          <input
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="action-send-btn" disabled={!message.trim()}>
            <FiSend size={16} />
          </button>
        </form>

      </div>
    </div>
<<<<<<< HEAD
    </main>
=======
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
  );
}

export default Chat;