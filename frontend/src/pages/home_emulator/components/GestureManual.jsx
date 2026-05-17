import React, { useState } from "react";
import { X, BookOpen } from "lucide-react";

const gestures = [
  {
    device: "Light",
    color: "amber",
    items: [
      { gesture: "Open Palm", icon: "🖐️", action: "Turn On" },
      { gesture: "Closed Fist", icon: "✊", action: "Turn Off" },
      { gesture: "Thumbs Up", icon: "👍", action: "Brightness Up" },
      { gesture: "Thumbs Down", icon: "👎", action: "Brightness Down" },
    ],
  },
  {
    device: "Door",
    color: "emerald",
    items: [
      { gesture: "Peace Sign", icon: "✌️", action: "Open Door" },
      { gesture: "Crossed Fingers", icon: "🤞", action: "Close Door" },
      { gesture: "Pinch", icon: "🤏", action: "Lock Door" },
      { gesture: "Four Fingers", icon: "🖖", action: "Unlock Door" },
    ],
  },
  {
    device: "TV",
    color: "blue",
    items: [
      { gesture: "L Sign", icon: "👆", action: "Turn On" },
      { gesture: "Middle Finger", icon: "🖕", action: "Turn Off" },
      { gesture: "Three Fingers", icon: "🤟", action: "Open Netflix" },
      { gesture: "Call Me Sign", icon: "🤙", action: "Open YouTube" },
      { gesture: "Spiderman Sign", icon: "🤘", action: "Open Disney" },
    ],
  },
  {
    device: "Speaker",
    color: "violet",
    items: [
      { gesture: "Rock Sign", icon: "🤘", action: "Turn On" },
      { gesture: "OK Sign", icon: "👌", action: "Turn Off" },
      { gesture: "Index Point Right", icon: "👉", action: "Play Music" },
      { gesture: "Index Point Left", icon: "👈", action: "Pause Music" },
      { gesture: "Raised Index", icon: "☝️", action: "Volume Up" },
      { gesture: "Raised Pinky", icon: "🤙", action: "Volume Down" },
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

export default function GestureManual() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        <BookOpen size={12} />
        Gesture Manual
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
                  <BookOpen size={14} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Gesture Manual
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Static hand gestures and their assigned actions
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
                {gestures.map((group) => {
                  const c = colorMap[group.color];

                  return (
                    <div
                      key={group.device}
                      className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.025]"
                    >
                      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${c.dot}`}
                        />
                        <span className={`text-[11px] font-bold ${c.header}`}>
                          {group.device}
                        </span>
                      </div>

                      <div className="divide-y divide-white/[0.04]">
                        {group.items.map((item) => (
                          <div
                            key={`${group.device}-${item.gesture}`}
                            className={`flex items-center justify-between px-3 py-2 transition ${c.row}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base leading-none">
                                {item.icon}
                              </span>
                              <span className="text-[11px] text-zinc-400">
                                {item.gesture}
                              </span>
                            </div>

                            <span
                              className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${c.badge}`}
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
                Hold each static gesture steady for about 2 seconds before
                switching to avoid accidental triggers.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}