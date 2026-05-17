import React, { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  DoorOpen,
  Tv,
  Music2,
  Mic,
  MicOff,
  X,
  ChevronUp,
} from "lucide-react";

import SmartHeader from "./components/SmartHeader";
import SmartRoom from "./components/SmartRoom";
import DeviceDock from "./components/DeviceDock";
import ActiveDevicePanel from "./components/ActiveDevicePanel";
import GestureCamera from "./components/GestureCamera";
import GestureManual from "./components/GestureManual";
import VoiceManual from "./components/VoiceManual";

function MobileBottomSheet({ open, onClose, activeDevice, devices, sendCommand }) {
  const startYRef = useRef(null);

  function onTouchStart(e) {
    startYRef.current = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (startYRef.current === null) return;

    const diff = e.changedTouches[0].clientY - startYRef.current;

    if (diff > 70) {
      onClose();
    }

    startYRef.current = null;
  }

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[72vh] overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#101018] shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />

        <div className="flex items-center justify-between px-5 py-3">
          <p className="text-xs font-semibold text-zinc-400">
            Device Controls
          </p>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400"
          >
            <X size={15} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 pb-8">
          <ActiveDevicePanel
            activeDevice={activeDevice}
            devices={devices}
            sendCommand={sendCommand}
          />
        </div>
      </div>
    </>
  );
}

function MobilePanelButton({ activeDevice, deviceTabs, onClick }) {
  const current = deviceTabs.find((item) => item.key === activeDevice);
  if (!current) return null;

  const Icon = current.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#141420]/95 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-xl lg:hidden"
    >
      <Icon size={14} className={current.active ? "text-emerald-400" : "text-zinc-400"} />
      {current.label} Controls
      <ChevronUp size={14} className="text-zinc-500" />
    </button>
  );
}

export default function HomeEmulator() {
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const [activeDevice, setActiveDevice] = useState("light");
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const [devices, setDevices] = useState({
    light: { on: false, brightness: 70 },
    door: { open: false, locked: false },
    tv: { on: false, volume: 40, channel: 1, app: "home" },
    speaker: {
      on: false,
      playing: false,
      volume: 50,
      track: "Demo Music",
      app: "spotify",
      src: "/audio/Bruno_Mars.mp3",
    },
  });

  function getSessionId() {
    let id = localStorage.getItem("smart_home_session_id");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("smart_home_session_id", id);
    }

    return id;
  }

  async function fetchState() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/state?sessionId=${getSessionId()}`
      );

      const data = await res.json();

      if (data.devices) {
        setDevices(data.devices);
      }
    } catch (error) {
      console.error("Failed to fetch state:", error);
    }
  }

  async function sendCommand(device, action, value = null) {
    try {
      const res = await fetch("http://localhost:3000/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device,
          action,
          value,
          sessionId: getSessionId(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        speak(data.message || "The command was not recognized.");
        return;
      }

      fetchState();
    } catch (error) {
      speak("Backend server is not running.");
      console.error(error);
    }
  }

  async function sendVoiceCommand(text) {
    try {
      const res = await fetch("http://localhost:3000/api/voice-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sessionId: getSessionId(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        speak(data.message || "The word is not recognized. Please try again.");
        return;
      }

      const action = data.command?.action || "";
      const device = data.command?.device || "";
      const artist = data.command?.artist || "";

      const messages = {
        light: {
          turn_on: "Turning on the light.",
          turn_off: "Turning off the light.",
          brightness_up: "Increasing light brightness.",
          brightness_down: "Decreasing light brightness.",
          open_disco: "Opening disco light.",
        },
        door: {
          open: "Opening the door.",
          close: "Closing the door.",
          lock: "Locking the door.",
          unlock: "Unlocking the door.",
        },
        tv: {
          turn_on: "Turning on the television.",
          turn_off: "Turning off the television.",
          volume_up: "Increasing TV volume.",
          volume_down: "Decreasing TV volume.",
          open_youtube: "Opening YouTube.",
          open_netflix: "Opening Netflix.",
          open_disney: "Opening Disney Plus.",
          go_home: "Opening TV home screen.",
        },
        speaker: {
          turn_on: "Turning on the speaker.",
          turn_off: "Turning off the speaker.",
          play: "Playing music.",
          pause: "Pausing music.",
          volume_up: "Increasing speaker volume.",
          volume_down: "Decreasing speaker volume.",
          open_spotify: "Opening Spotify.",
          play_artist: artist ? `Playing ${artist} song.` : "Playing selected song.",
        },
      };

      speak(messages[device]?.[action] || "Command applied.");
      fetchState();
    } catch (error) {
      speak("Backend server is not running. Please check your server.");
      console.error("Voice command failed:", error);
    }
  }

  function speak(message) {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.15;
    utterance.volume = 1;

    const voices = synth.getVoices();

    const selectedVoice =
      voices.find((voice) => voice.name.toLowerCase().includes("zira")) ||
      voices.find((voice) => voice.name.toLowerCase().includes("samantha")) ||
      voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synth.cancel();
    synth.speak(utterance);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setVoiceText("Listening...");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      speak("I could not hear you clearly. Please try again.");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;

      setVoiceText(transcript);
      await sendVoiceCommand(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  useEffect(() => {
    fetchState();

    const interval = setInterval(fetchState, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const src = devices.speaker?.src || "/audio/Bruno_Mars.mp3";

    if (!audio.src.includes(src)) {
      audio.src = src;
      audio.load();
    }

    audio.volume = Math.max(
      0,
      Math.min(1, (devices.speaker?.volume || 50) / 100)
    );

    if (devices.speaker?.on && devices.speaker?.playing) {
      audio.play().catch((error) => console.warn("Audio failed:", error.message));
    } else {
      audio.pause();
    }
  }, [devices.speaker]);

  const lightOn = devices.light?.on ?? false;
  const brightness = devices.light?.brightness ?? 70;

  const doorOpen = devices.door?.open ?? false;
  const doorLocked = devices.door?.locked ?? false;

  const tvOn = devices.tv?.on ?? false;
  const tvApp = devices.tv?.app ?? "home";

  const speakerOn = devices.speaker?.on ?? false;
  const speakerPlaying = devices.speaker?.playing ?? false;
  const speakerTrack = devices.speaker?.track ?? "Demo Music";

  const deviceTabs = [
    {
      key: "light",
      label: "Light",
      icon: Lightbulb,
      active: lightOn,
      status: lightOn ? `${brightness}%` : "Off",
    },
    {
      key: "door",
      label: "Door",
      icon: DoorOpen,
      active: doorOpen,
      status: doorOpen ? "Open" : doorLocked ? "Locked" : "Closed",
    },
    {
      key: "tv",
      label: "TV",
      icon: Tv,
      active: tvOn,
      status: tvOn ? tvApp.toUpperCase() : "Off",
    },
    {
      key: "speaker",
      label: "Speaker",
      icon: Music2,
      active: speakerOn,
      status: speakerPlaying ? speakerTrack : speakerOn ? "On" : "Off",
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#050509] text-white">
      <audio
        ref={audioRef}
        src={devices.speaker?.src || "/audio/Bruno_Mars.mp3"}
        loop
        preload="auto"
      />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.10),transparent_30%)]" />

      <div className="relative z-10 flex h-screen flex-col">
        <header className="shrink-0 px-3 pb-2 pt-3 lg:px-6 lg:pb-4 lg:pt-5">
          <div className="flex flex-col gap-3 lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <SmartHeader
                  listening={listening}
                  voiceText={voiceText}
                  onStartListening={startListening}
                />
              </div>

              <button
                onClick={startListening}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                  listening
                    ? "border-red-400/40 bg-red-400/10 text-red-400"
                    : "border-white/10 bg-white/5 text-zinc-400"
                }`}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <GestureCamera />
              <GestureManual />
              <VoiceManual />
            </div>
          </div>

          <div className="hidden items-center justify-between gap-4 lg:flex">
            <div className="min-w-0 flex-1">
              <SmartHeader
                listening={listening}
                voiceText={voiceText}
                onStartListening={startListening}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <GestureCamera />
              <GestureManual />
              <VoiceManual />

              <button
                onClick={startListening}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
                  listening
                    ? "border-red-400/40 bg-red-400/10 text-red-400"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-0 pb-24 lg:flex-row lg:gap-4 lg:overflow-hidden lg:px-3 lg:pb-3">
          <section className="flex min-h-0 flex-1 flex-col gap-3 lg:min-w-0 lg:w-full">
            <div className="min-h-[300px] flex-1 lg:min-h-0 lg:w-full">
              <SmartRoom
                devices={devices}
                deviceTabs={deviceTabs}
                voiceText={voiceText}
              />
            </div>

            <div className="shrink-0 overflow-x-auto">
              <DeviceDock
                deviceTabs={deviceTabs}
                activeDevice={activeDevice}
                onSelect={(device) => {
                  setActiveDevice(device);
                  setMobilePanelOpen(true);
                }}
              />
            </div>
          </section>

          <aside className="hidden w-[360px] shrink-0 overflow-y-auto lg:block xl:w-[400px]">
            <ActiveDevicePanel
              activeDevice={activeDevice}
              devices={devices}
              sendCommand={sendCommand}
            />
          </aside>
        </main>
      </div>

      <MobilePanelButton
        activeDevice={activeDevice}
        deviceTabs={deviceTabs}
        onClick={() => setMobilePanelOpen(true)}
      />

      <MobileBottomSheet
        open={mobilePanelOpen}
        onClose={() => setMobilePanelOpen(false)}
        activeDevice={activeDevice}
        devices={devices}
        sendCommand={sendCommand}
      />
    </div>
  );
}