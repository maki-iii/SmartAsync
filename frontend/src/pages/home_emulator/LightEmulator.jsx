import React from "react";
import { Lightbulb, Power, SunMedium } from "lucide-react";

export default function LightEmulator({
  isOn,
  brightness,
  onToggle,
  onBrightnessChange,
}) {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#111116] p-5 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Light Emulator</h2>
          <p className="text-xs text-zinc-500">
            Control the smart room light
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
            isOn
              ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-300"
              : "border-white/10 bg-white/5 text-zinc-500"
          }`}
        >
          <Lightbulb size={22} />
        </div>
      </div>

      {/* Light Visual */}
      <div className="mb-6 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/20 py-8">
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 ${
            isOn ? "bg-yellow-300/20" : "bg-white/5"
          }`}
          style={{
            boxShadow: isOn
              ? `0 0 ${brightness}px rgba(250, 204, 21, 0.55)`
              : "none",
          }}
        >
          {isOn && (
            <div
              className="absolute inset-0 rounded-full bg-yellow-300/20 blur-2xl"
              style={{
                opacity: brightness / 100,
              }}
            />
          )}

          <Lightbulb
            size={58}
            className={`relative z-10 transition-all duration-500 ${
              isOn ? "text-yellow-300" : "text-zinc-700"
            }`}
          />
        </div>

        <p
          className={`mt-5 rounded-full border px-4 py-1 text-xs font-mono ${
            isOn
              ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-300"
              : "border-white/10 bg-white/5 text-zinc-500"
          }`}
        >
          {isOn ? "● LIGHT ON" : "○ LIGHT OFF"}
        </p>
      </div>

      {/* Power Button */}
      <button
        onClick={onToggle}
        className={`mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
          isOn
            ? "border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20"
            : "border-yellow-300/30 bg-yellow-300/10 text-yellow-300 hover:bg-yellow-300/20"
        }`}
      >
        <Power size={17} />
        {isOn ? "Turn Off Light" : "Turn On Light"}
      </button>

      {/* Brightness */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-zinc-400">
            <SunMedium size={14} />
            Brightness
          </span>
          <span className="font-mono text-zinc-300">{brightness}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          disabled={!isOn}
          onChange={(e) => onBrightnessChange(Number(e.target.value))}
          className="w-full cursor-pointer accent-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
        />

        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}