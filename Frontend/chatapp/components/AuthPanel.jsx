import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function AuthPanel({ mode, onBack, onSuccess, onModeChange }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${isLogin ? "/users/login" : "/users"}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Authentication failed");
      if (isLogin) {
        onSuccess({ username: result.username || credentials.username, token: result.token });
      } else {
        onModeChange("login", "Account created. Log in to continue.");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-aside"><button className="brand-mark light-brand" onClick={onBack}><span className="brand-symbol">z</span><span>zoomly</span></button><div><p className="eyebrow light-eyebrow">Your room is waiting</p><h1>Bring your people<br /><em>closer.</em></h1><p>Meet with intention, leave with something worth remembering.</p></div><span className="aside-footnote">A little more human, every time.</span></div>
      <section className="auth-panel"><button className="back-button" onClick={onBack}><FiArrowLeft size={16} /> Back to home</button><div className="auth-content"><div className="auth-heading"><h2>{isLogin ? "Welcome back." : "Make it yours."}</h2><p>{isLogin ? "Pick up where you left off." : "Create an account for the conversations you want to keep."}</p></div><form className="auth-form" onSubmit={handleSubmit}><label>Username<div className="field-wrap"><FiUser /><input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="e.g. alex" autoComplete="username" required /></div></label><label>Password<div className="field-wrap"><FiLock /><input type={showPassword ? "text" : "password"} value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="Your secret passphrase" autoComplete={isLogin ? "current-password" : "new-password"} minLength="6" required /><button type="button" className="field-action" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div></label>{error && <p className="form-error">{error}</p>}<button className="primary-button form-submit" disabled={loading}>{loading ? "Working..." : isLogin ? "Enter my space" : "Create account"}<FiArrowRight size={17} /></button></form><p className="auth-switch">{isLogin ? "New to zoomly?" : "Already have an account?"} <button onClick={() => onModeChange(isLogin ? "signup" : "login")}>{isLogin ? "Create an account" : "Log in"}</button></p></div></section>
    </main>
  );
}

export default AuthPanel;
