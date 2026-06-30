import socket from "../src/socket";
import { useRef, useEffect, useState } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc;
let localStream;

function Video({ username }) {
  const startButton = useRef(null);
  const hangupButton = useRef(null);
  const muteAudButton = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [audiostate, setAudio] = useState(false);

  useEffect(() => {
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudButton.current) muteAudButton.current.disabled = true;

    const handleSocketMessage = (e) => {
      if (!localStream) {
        console.log("not ready yet");
        return;
      }
      switch (e.type) {
        case "offer":
          handleOffer(e);
          break;
        case "answer":
          handleAnswer(e);
          break;
        case "candidate":
          handleCandidate(e);
          break;
        case "ready":
          if (pc) {
            console.log("already in call, ignoring");
            return;
          }
          makeCall();
          break;
        case "bye":
          if (pc) {
            hangup();
          }
          break;
        default:
          console.log("unhandled", e);
          break;
      }
    };

    socket.on("message", handleSocketMessage);
    return () => {
      socket.off("message", handleSocketMessage);
    };
  }, []);

  async function makeCall() {
    try {
      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = (e) => {
        const message = { type: "candidate", candidate: null };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        socket.emit("message", message);
      };
      pc.ontrack = (e) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
      };
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      const offer = await pc.createOffer();
      socket.emit("message", { type: "offer", sdp: offer.sdp });
      await pc.setLocalDescription(offer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleOffer(offer) {
    if (pc) {
      console.error("existing peerconnection");
      return;
    }
    try {
      pc = new RTCPeerConnection(configuration);
      pc.onicecandidate = (e) => {
        const message = { type: "candidate", candidate: null };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        socket.emit("message", message);
      };
      pc.ontrack = (e) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
      };
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      socket.emit("message", { type: "answer", sdp: answer.sdp });
      await pc.setLocalDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAnswer(answer) {
    if (!pc) return;
    try {
      await pc.setRemoteDescription(answer);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCandidate(data) {
    try {
      if (!pc) return;
      if (!data.candidate) {
        await pc.addIceCandidate(null);
      } else {
        await pc.addIceCandidate(data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function hangup() {
    if (pc) {
      pc.close();
      pc = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }
    if (startButton.current) startButton.current.disabled = false;
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudButton.current) muteAudButton.current.disabled = true;
  }

  const startB = async () => {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { echoCancellation: true },
      });
      if (localVideo.current) localVideo.current.srcObject = localStream;
    } catch (err) {
      console.log(err);
    }
    startButton.current.disabled = true;
    hangupButton.current.disabled = false;
    muteAudButton.current.disabled = false;
    socket.emit("message", { type: "ready" });
  };

  const hangB = async () => {
    await hangup();
    socket.disconnect();
    socket.emit("message", { type: "bye" });
  };

  function muteAudio() {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudio(audioTrack.enabled);
    }
  }

  return (
    <div className="video-component-layout">
      {/* Video Viewports Block */}
      <div className="video-streams-grid">
        
        {/* Remote Camera Box (Main focused window) */}
        <div className="video-card-item remote-window">
          <video ref={remoteVideo} autoPlay playsInline placeholder="Remote Video Frame" />
          <div className="video-user-label">Remote Stream</div>
        </div>

        {/* Local Personal Camera Box (Made smaller, tucked cleanly inside corner layout) */}
        <div className="video-card-item local-window-preview">
          <video ref={localVideo} autoPlay playsInline muted placeholder="Local Video Frame" />
          <div className="video-user-label self-label">{username} (You)</div>
        </div>

      </div>

      {/* Embedded Controls Panel Row */}
      <div className="video-controls-row">
        <button className="ctrl-btn-item start-call" ref={startButton} onClick={startB}>
          <FiVideo size={16} />
          <span>Start</span>
        </button>
        <button className="ctrl-btn-item end-call" ref={hangupButton} onClick={hangB}>
          <FiVideoOff size={16} />
          <span>End</span>
        </button>
        <button className="ctrl-btn-item toggle-audio" ref={muteAudButton} onClick={muteAudio}>
          {!audiostate ? <FiMicOff size={16} /> : <FiMic size={16} />}
        </button>
      </div>
    </div>
  );
}

export default Video;