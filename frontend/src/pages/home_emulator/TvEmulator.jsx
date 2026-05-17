import React from "react";
import {
  Power,
  Volume2,
  Film,
  Tv2,
  PlaySquare,
} from "lucide-react";

export default function TVEmulator({
  isOn,
  volume,
  app = "home",
  onToggle,
  onVolumeChange,
  onOpenApp,
}) {
  return (
    <div className="h-full rounded-3xl border border-white/10 bg-[#111116] p-5 text-white">
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-bold">
          TV Emulator
        </h2>

        <p className="text-xs text-zinc-500">
          Smart TV with YouTube,
          Netflix, and Disney+
        </p>
      </div>

      {/* TV SCREEN */}
      <div className="mb-5 rounded-3xl border border-white/10 bg-black p-3">
        <div
          className={`relative flex h-44 items-center justify-center overflow-hidden rounded-2xl ${
            isOn
              ? "bg-blue-500/20"
              : "bg-black"
          }`}
        >
          {/* YOUTUBE */}
          {isOn &&
            app === "youtube" && (
              <iframe
                className="absolute inset-0 z-50 h-full w-full border-0"
                src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&mute=1"
                title="YouTube Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

          {/* HOME */}
          {isOn &&
            app === "home" && (
              <div className="relative z-30 text-center">
                <Tv2
                  size={40}
                  className="mx-auto text-blue-300"
                />

                <p className="mt-3 text-sm font-bold text-blue-300">
                  SMART TV
                </p>

                <p className="mt-2 text-[10px] font-mono text-blue-200/70">
                  VOL {volume}%
                </p>
              </div>
            )}

          {/* NETFLIX */}
          {isOn &&
            app === "netflix" && (
              <div className="relative z-30 text-center">
                <Film
                  size={40}
                  className="mx-auto text-white"
                />

                <p className="mt-3 text-sm font-bold tracking-widest text-white">
                  NETFLIX
                </p>

                <p className="mt-2 text-[10px] text-zinc-400">
                  Streaming Simulator
                </p>
              </div>
            )}

          {/* DISNEY */}
          {isOn &&
            app === "disney" && (
              <div className="relative z-30 text-center">
                <Tv2
                  size={40}
                  className="mx-auto text-blue-300"
                />

                <p className="mt-3 text-sm font-bold text-blue-300">
                  DISNEY+
                </p>

                <p className="mt-2 text-[10px] text-zinc-400">
                  Streaming Simulator
                </p>
              </div>
            )}

          {/* OFF */}
          {!isOn && (
            <p className="font-mono text-sm text-zinc-700">
              TV OFF
            </p>
          )}
        </div>
      </div>

      {/* APPS */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <button
          disabled={!isOn}
          onClick={() =>
            onOpenApp(
              "open_youtube"
            )
          }
          className="flex items-center justify-center gap-1 rounded-xl border border-red-400/20 bg-red-400/10 px-2 py-2 text-[10px] text-red-300 disabled:opacity-40"
        >
          <PlaySquare size={12} />
          YouTube
        </button>

        <button
          disabled={!isOn}
          onClick={() =>
            onOpenApp(
              "open_netflix"
            )
          }
          className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-[10px] text-white disabled:opacity-40"
        >
          Netflix
        </button>

        <button
          disabled={!isOn}
          onClick={() =>
            onOpenApp(
              "open_disney"
            )
          }
          className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-2 py-2 text-[10px] text-blue-300 disabled:opacity-40"
        >
          Disney+
        </button>
      </div>

      {/* POWER BUTTON */}
      <button
        onClick={onToggle}
        className={`mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
          isOn
            ? "border-red-400/30 bg-red-400/10 text-red-400"
            : "border-blue-400/30 bg-blue-400/10 text-blue-400"
        }`}
      >
        <Power size={17} />

        {isOn
          ? "Turn Off TV"
          : "Turn On TV"}
      </button>

      {/* VOLUME */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-2">
            <Volume2 size={14} />
            Volume
          </span>

          <span className="font-mono text-zinc-300">
            {volume}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          disabled={!isOn}
          onChange={(e) =>
            onVolumeChange(
              Number(e.target.value)
            )
          }
          className="w-full accent-blue-400 disabled:opacity-40"
        />
      </div>
    </div>
  );
}