import React, { useState, useEffect } from "react";
import {
  Tv,
  Lightbulb,
  DoorOpen,
  Music2,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Light Emulator",
    icon: Lightbulb,
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.10)",
    description:
      "Control the room light using voice commands, static hand gestures, and disco mode.",
    detail:
      "The Light Emulator lets users turn lights on or off, adjust brightness, and activate disco lighting using supported voice and gesture commands.",
    features: [
      "Turn on/off light",
      "Brightness control",
      "Disco light mode",
      "Voice and gesture support",
    ],
    demo: "Say: 'Open disco light'",
  },
  {
    title: "Door Emulator",
    icon: DoorOpen,
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.10)",
    description:
      "Open, close, lock, and unlock a simulated smart door with voice or gestures.",
    detail:
      "The Door Emulator demonstrates hands-free door control. Users can open or close the door, lock it when closed, and unlock it through assigned commands.",
    features: ["Open door", "Close door", "Lock door", "Unlock door"],
    demo: "Say: 'Open door'",
  },
  {
    title: "Speaker Emulator",
    icon: Music2,
    accent: "#f472b6",
    accentBg: "rgba(244,114,182,0.10)",
    description:
      "Play music, pause audio, control volume, and select artist songs.",
    detail:
      "The Speaker Emulator simulates a smart music player. It supports play, pause, volume control, Spotify mode, and artist-specific voice commands.",
    features: [
      "Play and pause music",
      "Volume control",
      "Spotify mode",
      "Artist song commands",
    ],
    demo: "Say: 'Play Bruno Mars song'",
  },
  {
    title: "TV Emulator",
    icon: Tv,
    accent: "#60a5fa",
    accentBg: "rgba(96,165,250,0.10)",
    description:
      "Control a smart TV and display YouTube, Netflix, or Disney+ on screen.",
    detail:
      "The TV Emulator allows users to turn the TV on or off, adjust volume, return to the home screen, and open streaming apps.",
    features: [
      "Turn TV on/off",
      "Open YouTube",
      "Open Netflix",
      "Open Disney+",
      "TV volume control",
    ],
    demo: "Say: 'Open Netflix'",
  },
];

function LoaderOverlay({ progress }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background:
          "radial-gradient(circle at top, rgba(167,139,250,0.22), rgba(5,5,9,0.96) 45%, #050509 100%)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          padding: "2rem",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "92px",
            height: "92px",
            margin: "0 auto 1.4rem",
          }}
        >
          <div className="loader-ring" />
          <div className="loader-orbit orbit-one" />
          <div className="loader-orbit orbit-two" />

          <div
            style={{
              position: "absolute",
              inset: "18px",
              borderRadius: "22px",
              background: "rgba(167,139,250,0.14)",
              border: "1px solid rgba(167,139,250,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#a78bfa",
            }}
          >
            <Zap size={28} />
          </div>
        </div>

        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.05rem",
            marginBottom: "0.4rem",
          }}
        >
          Preparing SmartSync
        </h2>

        <p
          style={{
            fontSize: "0.75rem",
            color: "#888",
            marginBottom: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          Connecting smart room modules, voice control, and gesture AI.
        </p>

        <div
          style={{
            height: "8px",
            width: "100%",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: "0.65rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: "999px",
              background:
                "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)",
              transition: "width 0.2s ease",
            }}
          />
        </div>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            color: "#aaa",
          }}
        >
          {progress}% Loading...
        </p>
      </div>
    </div>
  );
}

function Modal({ card, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const Icon = card.icon;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111114",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "440px",
          padding: "2rem",
          position: "relative",
          animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255,255,255,0.07)",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#aaa",
          }}
        >
          <X size={15} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: card.accentBg,
              border: `1px solid ${card.accent}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: card.accent,
            }}
          >
            <Icon size={20} />
          </div>

          <div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {card.title}
            </h2>

            <p
              style={{
                fontSize: "0.72rem",
                color: "#888",
                margin: 0,
                marginTop: "2px",
              }}
            >
              SmartSync Module
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: "0.82rem",
            color: "#bbb",
            lineHeight: 1.7,
            margin: "0 0 1.25rem",
          }}
        >
          {card.detail}
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <p
            style={{
              fontSize: "0.68rem",
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.6rem",
            }}
          >
            Capabilities
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {card.features.map((f) => (
              <span
                key={f}
                style={{
                  fontSize: "0.72rem",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: card.accentBg,
                  color: card.accent,
                  border: `1px solid ${card.accent}33`,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.68rem",
              color: "#666",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Sample Command
          </p>

          <p
            style={{
              fontSize: "0.78rem",
              color: "#ccc",
              margin: 0,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {card.demo}
          </p>
        </div>

        <div
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: "10px",
            background: card.accent,
            color: "#000",
            fontSize: "0.82rem",
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            letterSpacing: "0.01em",
            userSelect: "none",
          }}
        >
          Try It Now
        </div>
      </div>
    </div>
  );
}

export default function SmartSyncLanding() {
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  function handleGetStarted() {
    if (loading) return;

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + Math.floor(Math.random() * 14) + 8, 100);

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            navigate("/home");
          }, 350);
        }

        return next;
      });
    }, 180);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono&display=swap');

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        .loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.10);
          border-top-color: #a78bfa;
          border-right-color: #60a5fa;
          animation: spin 0.9s linear infinite;
        }

        .loader-orbit {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #34d399;
          box-shadow: 0 0 16px rgba(52,211,153,0.8);
          animation: floatPulse 1s ease-in-out infinite;
        }

        .orbit-one {
          top: 2px;
          left: 50%;
        }

        .orbit-two {
          bottom: 7px;
          right: 10px;
          background: #f472b6;
          box-shadow: 0 0 16px rgba(244,114,182,0.8);
          animation-delay: 0.25s;
        }

        .ss-card {
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .ss-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.18) !important;
        }

        .ss-showmore:hover {
          background: rgba(255,255,255,0.12) !important;
        }

        .ss-get:hover {
          background: rgba(255,255,255,0.92) !important;
          transform: scale(1.03);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse at 20% 0%, #2a1f4e 0%, #0d0d10 50%, #0a0f14 100%)",
          fontFamily: "'DM Sans', sans-serif",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "4rem 1.5rem 5rem",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "900px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(167,139,250,0.3)",
              background: "rgba(167,139,250,0.08)",
              fontSize: "0.7rem",
              color: "#a78bfa",
              fontFamily: "'DM Mono', monospace",
              marginBottom: "1.5rem",
            }}
          >
            <Zap size={11} /> Smart room voice and gesture simulator
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.8rem, 8vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textAlign: "center",
              background:
                "linear-gradient(160deg, #fff 40%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1rem",
            }}
          >
            SmartSync
          </h1>

          <p
            style={{
              fontSize: "0.9rem",
              color: "#888",
              textAlign: "center",
              maxWidth: "370px",
              lineHeight: 1.6,
              marginBottom: "3rem",
            }}
          >
            A smart room emulator that lets users control lights, door,
            TV, and speaker using voice commands and static hand gestures.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "14px",
              width: "100%",
              marginBottom: "3rem",
            }}
          >
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="ss-card"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: card.accentBg,
                      border: `1px solid ${card.accent}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.accent,
                    }}
                  >
                    <Icon size={17} />
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      color: "#f0f0f0",
                    }}
                  >
                    {card.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#777",
                      lineHeight: 1.6,
                      flexGrow: 1,
                    }}
                  >
                    {card.description}
                  </p>

                  <button
                    className="ss-showmore"
                    onClick={() => setActiveCard(card)}
                    style={{
                      alignSelf: "flex-start",
                      padding: "5px 12px",
                      borderRadius: "7px",
                      border:
                        "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#ccc",
                      fontSize: "0.7rem",
                      fontFamily: "'DM Mono', monospace",
                      cursor: "pointer",
                    }}
                  >
                    Show more →
                  </button>
                </div>
              );
            })}
          </div>

          <button
            className="ss-get"
            onClick={handleGetStarted}
            disabled={loading}
            style={{
              padding: "13px 40px",
              borderRadius: "999px",
              border: "none",
              background: "#fff",
              color: "#0a0a0e",
              fontSize: "0.85rem",
              fontWeight: 700,
              fontFamily: "'Syne', sans-serif",
              cursor: loading ? "wait" : "pointer",
              letterSpacing: "0.01em",
              transition: "background 0.2s, transform 0.2s",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Loading..." : "Get Started"}
          </button>
        </div>
      </div>

      {loading && <LoaderOverlay progress={progress} />}

      {activeCard && (
        <Modal
          card={activeCard}
          onClose={() => setActiveCard(null)}
        />
      )}
    </>
  );
}