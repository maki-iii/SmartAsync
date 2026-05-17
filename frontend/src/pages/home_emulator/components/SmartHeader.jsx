import React from "react";
import { Mic, MicOff, Volume2, Wifi, Sofa } from "lucide-react";

export default function SmartHeader({ listening, voiceText, onStartListening }) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Sofa size={18} className="text-emerald-300" />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight">SmartSync</h1>
          <p className="text-[11px] text-zinc-500">
            Voice-controlled smart room simulator
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {voiceText && (
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-zinc-400 md:flex">
            <Volume2 size={13} />
            <span className="max-w-[220px] truncate">{voiceText}</span>
          </div>
        )}

        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] text-emerald-300 sm:flex">
          <Wifi size={13} />
          Live
        </div>

        <button
          onClick={onStartListening}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
            listening
              ? "border-red-400/40 bg-red-400/15 text-red-300"
              : "border-emerald-400/30 bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/20"
          }`}
        >
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
          {listening ? "Listening..." : "Voice"}
        </button>
      </div>
    </header>
  );
}