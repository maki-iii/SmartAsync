import React from "react";
import {
  Music2,
  Play,
  Pause,
  Volume2,
  Disc3,
} from "lucide-react";

export default function SpeakerEmulator({
  isOn,
  playing,
  volume,
  app = "spotify",
  onToggle,
  onPlayPause,
  onVolumeChange,
  onOpenSpotify,
}) {
  return (
    <div className="h-full rounded-3xl border border-white/10 bg-[#111116] p-4 text-white">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-base font-bold">
          Smart Speaker
        </h2>

        <p className="text-[11px] text-zinc-500">
          Spotify music simulator
        </p>
      </div>

      {/* SPEAKER */}
      <div className="mb-4 flex justify-center">
        <div
          className={`relative flex h-32 w-28 flex-col items-center justify-center rounded-3xl border ${
            isOn
              ? "border-green-400/30 bg-green-400/10"
              : "border-white/10 bg-black/20"
          }`}
        >
          {/* WAVES */}
          {playing && (
            <>
              <div className="absolute h-24 w-24 animate-ping rounded-full border border-green-400/20" />
              <div className="absolute h-32 w-32 animate-ping rounded-full border border-green-400/10" />
            </>
          )}

          {/* ICON */}
          <Disc3
            className={`relative z-10 ${
              playing
                ? "animate-spin text-green-400"
                : isOn
                ? "text-green-400"
                : "text-zinc-700"
            }`}
            size={36}
          />

          {/* STATUS */}
          <p className="relative z-10 mt-3 text-[10px] font-mono text-zinc-400">
            {playing
              ? "SPOTIFY"
              : isOn
              ? "ON"
              : "OFF"}
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          onClick={onToggle}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
            isOn
              ? "border-red-400/30 bg-red-400/10 text-red-400"
              : "border-green-400/30 bg-green-400/10 text-green-400"
          }`}
        >
          {isOn
            ? "Turn Off"
            : "Turn On"}
        </button>

        <button
          onClick={onPlayPause}
          disabled={!isOn}
          className="flex items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-3 py-2 text-xs text-green-400 disabled:opacity-40"
        >
          {playing ? (
            <Pause size={15} />
          ) : (
            <Play size={15} />
          )}

          {playing ? "Pause" : "Play"}
        </button>
      </div>

      {/* SPOTIFY */}
      <button
        onClick={onOpenSpotify}
        className="mb-4 w-full rounded-xl border border-green-400/30 bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-400"
      >
        Open Spotify
      </button>

      {/* VOLUME */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-2">
            <Volume2 size={13} />
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
          className="w-full accent-green-400 disabled:opacity-40"
        />
      </div>
    </div>
  );
}