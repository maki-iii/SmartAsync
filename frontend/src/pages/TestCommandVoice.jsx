import React, { useRef, useState } from "react";

export default function VoiceTest() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  const recognitionRef = useRef(null);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      setText(transcript);

      console.log("Voice:", transcript);

      // SEND TO BACKEND
      const res = await fetch(
        "http://localhost:3000/api/voice-command",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: transcript,
          }),
        }
      );

      const data = await res.json();

      console.log(data);
    };

    recognition.start();

    recognitionRef.current = recognition;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <button
        onClick={startListening}
        style={{
          padding: "16px 30px",
          borderRadius: "14px",
          border: "none",
          cursor: "pointer",
          background: listening ? "#ef4444" : "#34d399",
          color: "white",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        {listening ? "Listening..." : "Start Voice"}
      </button>

      <p>{text}</p>
    </div>
  );
}