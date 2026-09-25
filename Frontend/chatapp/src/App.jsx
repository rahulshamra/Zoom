import { useEffect, useState } from "react";
import "./App.css";
import "./navbar.css";
import "./video-theme.css";
import "./chat-theme.css";
import "./dashboard-scroll.css";
import "./video-controls.css";
import "./landing-scroll.css";
import "./meeting.css";
import "./refinement.css";
import "./modal.css";
import "./history-modal.css";
import "./history-bubbles.css";
import AuthPanel from "../components/AuthPanel";
import Chat from "../components/chat";
import Dashboard from "../components/Dashboard";
import LandingPage from "../components/LandingPage";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function App() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState("loading");
  const [authMode, setAuthMode] = useState("login");
  const [notice, setNotice] = useState("");
  const [activeMeeting, setActiveMeeting] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/users/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((result) => {
        const currentUser = result?.payload || null;
        setSession(currentUser);
        setScreen(currentUser ? "dashboard" : "landing");
      })
      .catch(() => setScreen("landing"));
  }, []);

  const handleLogin = (nextSession) => {
    setSession(nextSession);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    fetch(`${API_URL}/users/logout`, { method: "POST", credentials: "include" });
    setSession(null);
    setScreen("landing");
  };

  if (screen === "room") {
    return <Chat username={session.username} meeting={activeMeeting} onLeaveRoom={() => setScreen("dashboard")} />;
  }

  if (screen === "loading") {
    return <div className="app-loading">Checking your space...</div>;
  }

  if (screen === "auth") {
    return <AuthPanel mode={authMode} onBack={() => setScreen("landing")} onSuccess={handleLogin} onModeChange={(mode, message = "") => { setAuthMode(mode); setNotice(message); }} />;
  }

  if (screen === "dashboard") {
    return <Dashboard username={session.username} onJoinRoom={(meeting) => { setActiveMeeting(meeting); setScreen("room"); }} onLogout={handleLogout} />;
  }

  return <>
    {notice && <div className="toast-note">{notice}</div>}
    <LandingPage onOpenAuth={(mode) => { setAuthMode(mode); setNotice(""); setScreen("auth"); }} />
  </>;
}

export default App
