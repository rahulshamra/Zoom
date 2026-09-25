import { useEffect, useState, useRef } from "react";
import {
  FiArrowRight,
  FiClock,
  FiLogOut,
  FiMessageCircle,
  FiPlus,
  FiTrash2,
  FiVideo,
  FiX,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function Dashboard({ username, onJoinRoom, onLogout }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [joining, setJoining] = useState(false);

  // Chat scroll reference
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever selected meeting or chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMeeting]);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/users/meetings`, { credentials: "include" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load meetings");
        return data;
      })
      .then((data) => {
        if (active) {
          setMeetings(
            data.map((meeting) => ({
              ...meeting,
              chatHistory: Array.isArray(meeting.chatHistory)
                ? meeting.chatHistory
                : [],
            }))
          );
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [username]);

  const handleJoinMeeting = async (event) => {
    event.preventDefault();
    if (!meetingName.trim()) return;
    try {
      setJoining(true);
      const response = await fetch(`${API_URL}/users/meetings`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingName: meetingName.trim() }),
      });
      const meeting = await response.json();
      if (!response.ok)
        throw new Error(meeting.message || "Unable to join meeting");
      setShowJoinForm(false);
      onJoinRoom(meeting);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setJoining(false);
    }
  };

  const updateMeeting = (meetingId, update) => {
    setMeetings((current) =>
      current.map((meeting) =>
        meeting._id === meetingId ? { ...meeting, ...update } : meeting
      )
    );
    setSelectedMeeting((current) =>
      current?._id === meetingId ? { ...current, ...update } : current
    );
  };

  const handleClear = async (meetingId) => {
    if (!window.confirm("Clear this meeting's chat history?")) return;
    try {
      const response = await fetch(
        `${API_URL}/users/meetings/${meetingId}/chat-history`,
        { method: "DELETE", credentials: "include" }
      );
      if (!response.ok) throw new Error("Unable to clear history");
      updateMeeting(meetingId, { chatHistory: [] });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const renderMeetingModal = () => {
    if (!selectedMeeting) return null;
    return (
      <div
        className="meeting-modal-backdrop"
        onClick={() => setSelectedMeeting(null)}
      >
        <section
          className="chat-history-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="chat-history-modal-header">
            <div>
              <span className="meeting-kicker">MEETING HISTORY</span>
              <h2>{selectedMeeting.meetingName}</h2>
              <p>
                {selectedMeeting.chatHistory.length} saved message
                {selectedMeeting.chatHistory.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="modal-actions">
              {selectedMeeting.chatHistory.length > 0 && (
                <button
                  className="clear-button"
                  onClick={() => handleClear(selectedMeeting._id)}
                >
                  <FiTrash2 size={14} /> Clear
                </button>
              )}
              <button
                className="modal-close"
                onClick={() => setSelectedMeeting(null)}
                aria-label="Close history"
              >
                <FiX />
              </button>
            </div>
          </header>
          <div className="modal-message-list">
            {selectedMeeting.chatHistory.length === 0 ? (
              <div className="empty-history">
                <FiMessageCircle />
                <h3>No messages yet.</h3>
                <p>Your conversation will appear here.</p>
              </div>
            ) : (
              <>
                {selectedMeeting.chatHistory.map((message) => (
                  <article
                    className={`history-item ${
                      message.username === username
                        ? "history-item-self"
                        : "history-item-other"
                    }`}
                    key={message._id || message.time}
                  >
                    <div className="history-message">
                      <strong>{message.username}</strong>
                      <span className="history-message-text">
                        {message.message}
                      </span>
                      <time>
                        {new Date(message.time).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </div>
                  </article>
                ))}
                {/* Auto-scroll anchor */}
                <div ref={chatEndRef} />
              </>
            )}
          </div>
          <footer className="chat-history-modal-footer">
            <button
              className="outline-button"
              onClick={() => setSelectedMeeting(null)}
            >
              Close
            </button>
          </footer>
        </section>
      </div>
    );
  };

  return (
    <main className="dashboard-page">
      <nav className="private-nav">
        <button
          className="brand-mark"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="brand-symbol">z</span>
          <span>zoomly</span>
        </button>
        <div className="private-nav-right">
          <span className="user-chip">
            <span>{username.slice(0, 1).toUpperCase()}</span>
            {username}
          </span>
          <button
            className="logout-button"
            onClick={onLogout}
            aria-label="Log out"
          >
            <FiLogOut />
          </button>
        </div>
      </nav>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Your private lounge
          </p>
          <h1>
            Good to see you,
            <br />
            <em>{username}.</em>
          </h1>
          <p>Choose a meeting or start a new one.</p>
        </div>
        <button
          className="join-room-button"
          onClick={() => setShowJoinForm(true)}
        >
          <FiVideo />
          <span>Join a meeting</span>
          <FiArrowRight size={17} />
        </button>
      </section>
      <section className="dashboard-grid">
        <div className="history-panel">
          <div className="panel-heading">
            <div>
              <h2>Your meetings</h2>
              <p>Click a room to open its conversation.</p>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          {loading ? (
            <div className="empty-history">
              <FiClock />
              <p>Loading your meetings...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="empty-history">
              <FiMessageCircle />
              <h3>No meetings yet.</h3>
              <p>Create a meeting name to start your first room.</p>
              <button
                className="outline-button"
                onClick={() => setShowJoinForm(true)}
              >
                Create a meeting <FiArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="meeting-summary-list">
              {meetings.map((meeting) => (
                <button
                  className="meeting-summary"
                  key={meeting._id}
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <span className="meeting-summary-icon">
                    <FiVideo />
                  </span>
                  <span>
                    <strong>{meeting.meetingName}</strong>
                    <small>
                      {meeting.chatHistory.length} message
                      {meeting.chatHistory.length === 1 ? "" : "s"} ·{" "}
                      {new Date(
                        meeting.meetingStartDate
                      ).toLocaleDateString()}
                    </small>
                  </span>
                  <FiArrowRight className="summary-arrow" />
                </button>
              ))}
            </div>
          )}
        </div>
        <aside className="dashboard-aside">
          <div className="aside-card accent-card">
            <span className="card-kicker">A NEW ROOM</span>
            <h3>
              Give it a name
              <br />
              <em>and begin.</em>
            </h3>
            <p>
              Meeting history stays organized by the room where it happened.
            </p>
            <button onClick={() => setShowJoinForm(true)}>
              Open a meeting <FiArrowRight size={15} />
            </button>
          </div>
          <div className="aside-card stats-card">
            <div>
              <FiClock />
              <span>Meetings saved</span>
              <strong>{meetings.length}</strong>
            </div>
            <div>
              <FiPlus />
              <span>Ready to start</span>
              <strong> room</strong>
            </div>
          </div>
        </aside>
      </section>
      {showJoinForm && (
        <div
          className="meeting-modal-backdrop"
          onClick={() => setShowJoinForm(false)}
        >
          <form
            className="meeting-modal"
            onSubmit={handleJoinMeeting}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowJoinForm(false)}
              aria-label="Close"
            >
              <FiX />
            </button>
            <span className="section-number">05</span>
            <h2>Name your meeting.</h2>
            <p>Use the same name to return to this room later.</p>
            <label>
              Meeting name
              <input
                value={meetingName}
                onChange={(event) => setMeetingName(event.target.value)}
                placeholder="e.g. Monday stand-up"
                autoFocus
                required
                maxLength="80"
              />
            </label>
            <button className="primary-button form-submit" disabled={joining}>
              {joining ? "Opening..." : "Enter meeting"}
              <FiArrowRight size={17} />
            </button>
          </form>
        </div>
      )}
      {renderMeetingModal()}
    </main>
  );
}

export default Dashboard;