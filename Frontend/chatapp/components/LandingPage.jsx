import { FiArrowRight, FiMessageCircle, FiShield, FiVideo } from "react-icons/fi";

function LandingPage({ onOpenAuth }) {
  return (
    <main className="landing-page">
      <nav className="public-nav">
        <button className="brand-mark" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="brand-symbol">z</span>
          <span>zoomly</span>
        </button>
        <button className="nav-login" onClick={() => onOpenAuth("login")}>Log in <FiArrowRight size={15} /></button>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Rooms for real conversations</p>
          <h1>Make space for <em>good</em> conversation.</h1>
          <p className="hero-description">A calmer way to meet, talk, and stay connected. Join a room, share a thought, and keep the moments that matter close.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onOpenAuth("signup")}>Create your space <FiArrowRight size={17} /></button>
            <button className="text-button" onClick={() => onOpenAuth("login")}>I already have an account</button>
          </div>
          <div className="hero-note"><span className="avatar-stack"><i>R</i><i>M</i><i>S</i></span><span>Made for small groups and big ideas.</span></div>
        </div>
        <div className="hero-visual" aria-label="A video room illustration">
          <div className="sun-disc" />
          <div className="room-card room-card-main"><div className="room-card-top"><span className="live-pill"><span /> LIVE ROOM</span><span className="room-time">09:41</span></div><div className="person-shape person-one"><span /></div><div className="room-caption"><strong>Morning stand-up</strong><span>4 people are here</span></div></div>
          <div className="room-card room-card-small"><span className="small-label">YOUR SPACE</span><div className="mini-avatar">K</div><strong>Ready when you are.</strong></div>
          <div className="meeting-polaroid meeting-polaroid-one"><span className="polaroid-image"><i /></span><strong>Late-night ideas</strong><small>3 people · 21:08</small></div>
          <div className="meeting-polaroid meeting-polaroid-two"><span className="polaroid-image"><i /></span><strong>Sunday coffee</strong><small>2 people · 10:32</small></div>
          <div className="scribble">stay awhile <span>↗</span></div>
        </div>
      </section>

      <section className="feature-strip" id="about">
        <div className="feature-intro"><h2>Less noise.<br /><em>More presence.</em></h2></div>
        <div className="feature-item"><FiVideo /><h3>Rooms that feel human</h3><p>Jump into a focused video room without the clutter.</p></div>
        <div className="feature-item"><FiMessageCircle /><h3>Conversations that last</h3><p>Your chat history stays with you, ready whenever you return.</p></div>
        <div className="feature-item"><FiShield /><h3>Private by design</h3><p>Your account and conversations belong to you.</p></div>
      </section>

      <footer className="landing-footer"><span>zoomly / rooms for real conversations</span><button onClick={() => onOpenAuth("signup")}>Make a room <FiArrowRight size={14} /></button></footer>
    </main>
  );
}

export default LandingPage;
