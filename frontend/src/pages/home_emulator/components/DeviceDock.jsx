import React from "react";

export default function DeviceDock({ deviceTabs, activeDevice, onSelect }) {
  return (
    <div className="shrink-0 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-3">
        {deviceTabs.map((tab) => {
          const Icon = tab.icon;
          const selected = activeDevice === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelect(tab.key)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                selected
                  ? "border-white/20 bg-white/10"
                  : "border-white/10 bg-black/20 hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    tab.active
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-zinc-500"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div
                  className={`h-2 w-2 rounded-full ${
                    tab.active ? "bg-emerald-400" : "bg-zinc-700"
                  }`}
                />
              </div>

              <p className="mt-3 text-xs font-bold">{tab.label}</p>
              <p className="mt-0.5 text-[10px] text-zinc-500">{tab.status}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}