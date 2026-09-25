import { useState, useEffect, useRef } from "react";
import socket from "../src/socket";
import Video from "./video";
import { FiSend, FiLogOut, FiUsers } from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function Chat({ username, meeting, onLeaveRoom }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let active = true;
    const meetingId = meeting.meetingId || meeting._id;
    socket.auth = { meetingId };

    const receiveData = (data) =>
      setMessages((previous) => [...previous, data]);
    const connectedUsers = (count) => setOnlineUsers(count);
    const handleConnect = () => {
      setSocketConnected(true);
      setSocketError("");
    };
    const handleDisconnect = () => setSocketConnected(false);
    const handleConnectError = () => {
      setSocketConnected(false);
      setSocketError("Room connection failed. Please re-enter the meeting.");
    };

    socket.on("chat message", receiveData);
    socket.on("user joined", receiveData);
    socket.on("user left", receiveData);
    socket.on("online users", connectedUsers);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    const historyRequest = fetch(
      `${API_URL}/users/meetings/${meetingId}/chat-history`,
      { credentials: "include" },
    )
      .then((response) => (response.ok ? response.json() : { chatHistory: [] }))
      .then((result) => {
        if (active) setMessages(result.chatHistory || []);
      })
      .catch(() => {
        if (active) setSocketError("Unable to load meeting history.");
      });

    historyRequest.finally(() => {
      if (active) socket.connect();
    });

    return () => {
      active = false;
      socket.off("chat message", receiveData);
      socket.off("user joined", receiveData);
      socket.off("user left", receiveData);
      socket.off("online users", connectedUsers);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [meeting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim() || !socket.connected) {
      setSocketError("Waiting for the room connection...");
      return;
    }

    const data = { username, message: message.trim() };
    setMessages((previous) => [...previous, data]);
    socket.emit("chat message", data, (result) => {
      if (!result?.ok) setSocketError("Message was not delivered.");
    });
    setMessage("");
  };

  const handleDisconnect = () => {
    socket.disconnect();
    setMessages([]);
    onLeaveRoom();
  };

  return (
    <main className="room-page">
      <header className="room-nav">
        <div className="brand-mark">
          <span className="brand-symbol">z</span>
          <span>zoomly</span>
        </div>
        <div className="room-nav-meta">
          <span className="room-status-dot" /> Private room{" "}
          <span className="room-user">{username}</span>
        </div>
      </header>
      <div className="room-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Your live space
          </p>
          <h1>
            Stay in the <em>room.</em>
          </h1>
        </div>
        <p>Talk freely, keep the thread.</p>
      </div>
      <div className="app-workspace">
        <div className="video-workspace-pane">
          <Video username={username} />
        </div>
        <div className="chat-workspace-pane">
          <div className="pane-header">
            <div className="room-meta">
              <span className="chat-panel-kicker">LIVE CONVERSATION</span>
              <h3>{meeting.meetingName}</h3>
              <div className="live-counter">
                <FiUsers size={14} />
                <span>
                  {socketConnected ? `${onlineUsers} Active` : "Connecting..."}
                </span>
              </div>
            </div>
            <button onClick={handleDisconnect} className="exit-btn">
              <FiLogOut size={16} />
              <span>Leave</span>
            </button>
          </div>
          <div className="messages-scroller">
            {messages.map((msg, index) => {
              if (!msg.username && !msg.message) return null;
              if (msg.message === "Connected") {
                return (
                  <div key={index} className="system-banner join">
                    <span>● {msg.username || "New user"} connected</span>
                  </div>
                );
              }
              if (msg.message === "Left") {
                return (
                  <div key={index} className="system-banner leave">
                    <span>● {msg.username || "A user"} disconnected</span>
                  </div>
                );
              }
              const isSelf = msg.username === username;
              return (
                <div
                  key={index}
                  className={`msg-row-wrapper ${isSelf ? "outgoing" : "incoming"}`}
                >
                  <div className="bubble-wrapper">
                    <div className="chat-bubble">
                      <span className="bubble-author">
                        {isSelf ? "You" : msg.username}
                      </span>
                      <p className="bubble-text"
                        style={{ color: isSelf ? "inherit" : "black" }}>{msg.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          {socketError && <p className="room-error">{socketError}</p>}
          <form onSubmit={handleSubmit} className="pane-input-footer">
            <input
              type="text"
              placeholder="Send a message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button
              type="submit"
              className="action-send-btn"
              disabled={!message.trim()}
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Chat;
