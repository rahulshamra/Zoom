import { useState, useEffect, useRef } from "react";
import socket from "../src/socket";
import Video from "./video";
import { FiSend, FiLogOut, FiUsers } from "react-icons/fi";

function Chat({ username, setUsername }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, SetonlineUsers] = useState(0);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const receiveData = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const connectedUsers = (count) => {
      SetonlineUsers(count);
    };

    socket.on("chat message", receiveData);
    socket.on("user joined", receiveData); 
    socket.on("user left", receiveData);
    socket.on("online users", connectedUsers);

    return () => {
      socket.off("chat message", receiveData);
      socket.off("user joined", receiveData);
      socket.off("user left", receiveData);
      socket.off("online users", connectedUsers);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const data = {
      username: username,
      message: message
    };

    setMessages((prevmessages) => [...prevmessages, data]);
    socket.emit("chat message", data);
    setMessage("");
  };

  const handleDisconnect = () => {
    socket.disconnect();
    setMessages([]);
    setUsername("");
  };

  return (
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
            <h3>Live Streaming Room</h3>
            <div className="live-counter">
              <FiUsers size={14} />
              <span>{onlineUsers} Active</span>
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
  );
}

export default Chat;