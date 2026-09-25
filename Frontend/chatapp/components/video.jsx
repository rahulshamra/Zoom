import socket from "../src/socket";
import { useRef, useEffect, useState } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";

const configuration = {
  iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] }],
  iceCandidatePoolSize: 10,
};

let peerConnection;
let localStream;

function Video({ username }) {
  const startButton = useRef(null);
  const hangupButton = useRef(null);
  const muteAudioButton = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [audioState, setAudioState] = useState(false);
  const [roomConnected, setRoomConnected] = useState(socket.connected);
  const [callError, setCallError] = useState("");

  useEffect(() => {
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudioButton.current) muteAudioButton.current.disabled = true;

    const handleConnect = () => {
      setRoomConnected(true);
      setCallError("");
    };
    const handleDisconnect = () => setRoomConnected(false);
    const handleConnectError = () => {
      setRoomConnected(false);
      setCallError("Video room connection failed.");
    };
    const handleSocketMessage = (event) => {
      if (!localStream) return;
      switch (event.type) {
        case "offer":
          handleOffer(event);
          break;
        case "answer":
          handleAnswer(event);
          break;
        case "candidate":
          handleCandidate(event);
          break;
        case "ready":
          if (!peerConnection) makeCall();
          break;
        case "bye":
          if (peerConnection) hangup();
          break;
        default:
          break;
      }
    };

    socket.on("message", handleSocketMessage);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    return () => {
      socket.off("message", handleSocketMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      hangup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function makeCall() {
    try {
      peerConnection = new RTCPeerConnection(configuration);
      configurePeerConnection();
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("message", { type: "offer", sdp: offer.sdp });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOffer(offer) {
    if (peerConnection) return;
    try {
      peerConnection = new RTCPeerConnection(configuration);
      configurePeerConnection();
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("message", { type: "answer", sdp: answer.sdp });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAnswer(answer) {
    if (!peerConnection) return;
    try {
      await peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCandidate(data) {
    if (!peerConnection) return;
    try {
      await peerConnection.addIceCandidate(data.candidate ? data : null);
    } catch (error) {
      console.error(error);
    }
  }

  function configurePeerConnection() {
    peerConnection.onicecandidate = (event) => {
      const message = { type: "candidate", candidate: null };
      if (event.candidate) {
        message.candidate = event.candidate.candidate;
        message.sdpMid = event.candidate.sdpMid;
        message.sdpMLineIndex = event.candidate.sdpMLineIndex;
      }
      socket.emit("message", message);
    };
    peerConnection.ontrack = (event) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0];
    };
  }

  async function hangup() {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }
    if (startButton.current) startButton.current.disabled = false;
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudioButton.current) muteAudioButton.current.disabled = true;
  }

  const startCall = async () => {
    if (!socket.connected) {
      setCallError("Waiting for the room connection...");
      return;
    }
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
      if (localVideo.current) localVideo.current.srcObject = localStream;
    } catch (error) {
      console.error("Unable to access camera and microphone:", error);
      setCallError("Camera or microphone permission is required.");
      return;
    }
    startButton.current.disabled = true;
    hangupButton.current.disabled = false;
    muteAudioButton.current.disabled = false;
    socket.emit("message", { type: "ready" });
  };

  const endCall = async () => {
    socket.emit("message", { type: "bye" });
    await hangup();
  };

  const toggleAudio = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioState(audioTrack.enabled);
    }
  };

  return (
    <div className="video-component-layout video-room-theme">
      <div className="video-panel-heading">
        <div>
          <span className="video-panel-kicker">LIVE CAMERA</span>
          <h3>Face to face</h3>
        </div>
        <span className={`video-connection-badge ${roomConnected ? "is-connected" : "is-offline"}`}>
          <i /> {roomConnected ? "Ready" : "Offline"}
        </span>
      </div>
      {callError && <p className="room-error video-error">{callError}</p>}
      <div className="video-streams-grid">
        <div className="video-card-item remote-window"><video ref={remoteVideo} autoPlay playsInline /><div className="video-user-label">Remote Stream</div></div>
        <div className="video-card-item local-window-preview"><video ref={localVideo} autoPlay playsInline muted /><div className="video-user-label self-label">{username} (You)</div></div>
      </div>
      <div className="video-controls-row">
        <button className="ctrl-btn-item start-call" ref={startButton} onClick={startCall} disabled={!roomConnected} aria-label="Start camera"><FiVideo size={16} /><span>Start camera</span></button>
        <button className="ctrl-btn-item end-call" ref={hangupButton} onClick={endCall} aria-label="End call"><FiVideoOff size={16} /><span>End call</span></button>
        <button className="ctrl-btn-item toggle-audio" ref={muteAudioButton} onClick={toggleAudio} aria-label={audioState ? "Mute microphone" : "Unmute microphone"}>{!audioState ? <FiMicOff size={16} /> : <FiMic size={16} />}<span>{audioState ? "Mute" : "Mic"}</span></button>
      </div>
    </div>
  );
}

export default Video;
