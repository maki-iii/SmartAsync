import React, { useState } from "react";
import { X, BookOpen, Mic } from "lucide-react";

const voiceCommands = [
  {
    device: "Light",
    color: "amber",
    items: [
      { command: "Turn on light", action: "Turn On" },
      { command: "Light on", action: "Turn On" },
      { command: "Turn off light", action: "Turn Off" },
      { command: "Light off", action: "Turn Off" },
      { command: "Open disco light", action: "Disco Mode" },
    ],
  },
  {
    device: "Door",
    color: "emerald",
    items: [
      { command: "Open door", action: "Open Door" },
      { command: "Close door", action: "Close Door" },
      { command: "Lock door", action: "Lock Door" },
      { command: "Unlock door", action: "Unlock Door" },
    ],
  },
  {
    device: "TV",
    color: "blue",
    items: [
      { command: "Turn on TV", action: "Turn On" },
      { command: "TV on", action: "Turn On" },
      { command: "Turn off TV", action: "Turn Off" },
      { command: "TV off", action: "Turn Off" },

      { command: "Open YouTube", action: "Open YouTube" },
      { command: "Play YouTube", action: "Open YouTube" },

      { command: "Open Netflix", action: "Open Netflix" },
      { command: "Play Netflix", action: "Open Netflix" },

      { command: "Open Disney", action: "Open Disney+" },
      { command: "Open Disney Plus", action: "Open Disney+" },
      { command: "Play Disney Plus", action: "Open Disney+" },

      { command: "Go home TV", action: "Go Home" },

      { command: "TV volume up", action: "Volume Up" },
      { command: "TV volume down", action: "Volume Down" },
    ],
  },
  {
    device: "Speaker",
    color: "violet",
    items: [
      { command: "Play music", action: "Play Music" },
      { command: "Pause music", action: "Pause Music" },
      { command: "Stop music", action: "Pause Music" },

      { command: "Open Spotify", action: "Open Spotify" },
      { command: "Play Spotify", action: "Open Spotify" },

      { command: "Volume up", action: "Volume Up" },
      { command: "Volume down", action: "Volume Down" },

      { command: "Play Bruno Mars song", action: "Play Bruno Mars" },
      { command: "Play Ariana Grande song", action: "Play Ariana Grande" },
      { command: "Play Chris Brown song", action: "Play Chris Brown" },
      { command: "Play Justin Bieber song", action: "Play Justin Bieber" },
      { command: "Play The Weeknd song", action: "Play The Weeknd" },
    ],
  },
];

const colorMap = {
  amber: {
    badge: "bg-amber-400/10 border-amber-400/20 text-amber-300",
    dot: "bg-amber-400",
    header: "text-amber-300",
    row: "hover:bg-amber-400/5",
  },
  emerald: {
    badge: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300",
    dot: "bg-emerald-400",
    header: "text-emerald-300",
    row: "hover:bg-emerald-400/5",
  },
  blue: {
    badge: "bg-blue-400/10 border-blue-400/20 text-blue-300",
    dot: "bg-blue-400",
    header: "text-blue-300",
    row: "hover:bg-blue-400/5",
  },
  violet: {
    badge: "bg-violet-400/10 border-violet-400/20 text-violet-300",
    dot: "bg-violet-400",
    header: "text-violet-300",
    row: "hover:bg-violet-400/5",
  },
};

export default function VoiceManual() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        <BookOpen size={12} />
        Voice Manual
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative mx-4 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400">
                  <Mic size={14} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">Voice Manual</p>
                  <p className="text-[10px] text-zinc-500">
                    Supported voice commands and actions
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={13} />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {voiceCommands.map((group) => {
                  const c = colorMap[group.color];

                  return (
                    <div
                      key={group.device}
                      className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025]"
                    >
                      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                        <span className={`text-[11px] font-bold ${c.header}`}>
                          {group.device}
                        </span>
                      </div>

                      <div className="divide-y divide-white/[0.04]">
                        {group.items.map((item) => (
                          <div
                            key={`${group.device}-${item.command}`}
                            className={`flex items-center justify-between gap-3 px-3 py-2 transition ${c.row}`}
                          >
                            <div className="flex items-center gap-2">
                              <Mic size={12} className="shrink-0 text-zinc-600" />
                              <span className="text-[11px] text-zinc-400">
                                “{item.command}”
                              </span>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${c.badge}`}
                            >
                              {item.action}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-[10px] text-zinc-600">
                Speak clearly and use one command at a time for better voice recognition.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}