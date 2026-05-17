import React from "react";
import { DoorOpen, DoorClosed, Lock, Unlock } from "lucide-react";

export default function DoorEmulator({
  isOpen,
  isLocked,
  onToggleDoor,
  onToggleLock,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111116] p-5 text-white">
      <h2 className="text-lg font-bold">Door Emulator</h2>
      <p className="mb-6 text-xs text-zinc-500">Open, close, lock, and unlock door</p>

      <div className="mb-6 flex justify-center">
        <div className="relative h-56 w-36 rounded-t-2xl border border-white/10 bg-black/30" style={{ perspective: "800px" }}>
          <div
            className="absolute inset-0 origin-left rounded-t-2xl border-r-2 border-emerald-400/40 bg-emerald-400/10 transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isOpen ? "rotateY(-70deg)" : "rotateY(0deg)",
            }}
          >
            <div className="absolute right-3 top-1/2 h-3 w-3 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>

      <div className="mb-5 flex justify-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-mono ${isOpen ? "border-emerald-400/30 text-emerald-400" : "border-white/10 text-zinc-500"}`}>
          {isOpen ? "● OPEN" : "○ CLOSED"}
        </span>

        <span className={`rounded-full border px-3 py-1 text-xs font-mono ${isLocked ? "border-red-400/30 text-red-400" : "border-emerald-400/30 text-emerald-400"}`}>
          {isLocked ? "LOCKED" : "UNLOCKED"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onToggleDoor}
          disabled={isLocked}
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isOpen ? <DoorClosed size={17} /> : <DoorOpen size={17} />}
          {isOpen ? "Close" : "Open"}
        </button>

        <button
          onClick={onToggleLock}
          disabled={isOpen}
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLocked ? <Unlock size={17} /> : <Lock size={17} />}
          {isLocked ? "Unlock" : "Lock"}
        </button>
      </div>
    </div>
  );
}