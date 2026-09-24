import { useState } from "react";
import socket from "../src/socket";
import { FiUser, FiArrowRight } from "react-icons/fi";

function SetUserName({ setUsername }) {
  const [uname, setUname] = useState("");

  const handleChange = (e) => setUname(e.target.value);

  const submitForm = (e) => {
    e.preventDefault();
    if (!uname.trim()) return;
    setUsername(uname);
    socket.emit("set username", uname);
  };

  return (
    <div className="su-container">
      <div className="su-glass-card">
        {/* Decorative background glow elements */}
        <div className="su-glow-1"></div>
        <div className="su-glow-2"></div>

        <div className="su-content">
          <div className="su-header">
            <div className="su-avatar-wrapper">
              <FiUser size={40} className="su-avatar-icon" />
            </div>
            <h2>Welcome to the App</h2>
            <p>Please enter a username to start chatting and video calling</p>
          </div>

          <form onSubmit={submitForm} className="su-form">
            <div className="su-input-group">
              <FiUser className="su-input-icon" />
              <input
                type="text"
                placeholder="Enter your username..."
                value={uname}
                onChange={handleChange}
                maxLength={20}
                autoFocus
              />
            </div>
            <button type="submit" className="su-submit-btn" disabled={!uname.trim()}>
              <span>Join Lounge</span>
              <FiArrowRight size={18} className="su-btn-arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetUserName;