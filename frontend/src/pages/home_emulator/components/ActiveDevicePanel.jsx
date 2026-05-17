import React from "react";

import LightEmulator from "../LightEmulator";
import DoorEmulator from "../DoorEmulator";
import TVEmulator from "../TVEmulator";
import SpeakerEmulator from "../SpeakerEmulator";

export default function ActiveDevicePanel({
  activeDevice,
  devices,
  sendCommand,
}) {
  const lightOn =
    devices.light?.on ?? false;

  const brightness =
    devices.light?.brightness ?? 70;

  const doorOpen =
    devices.door?.open ?? false;

  const doorLocked =
    devices.door?.locked ?? false;

  const tvOn =
    devices.tv?.on ?? false;

  const tvVolume =
    devices.tv?.volume ?? 40;

  const tvApp =
    devices.tv?.app ?? "home";

  const speakerOn =
    devices.speaker?.on ?? false;

  const speakerPlaying =
    devices.speaker?.playing ??
    false;

  const speakerVolume =
    devices.speaker?.volume ?? 50;

  const speakerApp =
    devices.speaker?.app ??
    "spotify";

  return (
    <aside className="min-h-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl">
      {/* LIGHT */}
      {activeDevice === "light" && (
        <LightEmulator
          isOn={lightOn}
          brightness={brightness}
          onToggle={() =>
            sendCommand(
              "light",
              lightOn
                ? "turn_off"
                : "turn_on"
            )
          }
          onBrightnessChange={(
            value
          ) =>
            sendCommand(
              "light",
              "set_brightness",
              value
            )
          }
        />
      )}

      {/* DOOR */}
      {activeDevice === "door" && (
        <DoorEmulator
          isOpen={doorOpen}
          isLocked={doorLocked}
          onToggleDoor={() =>
            sendCommand(
              "door",
              doorOpen
                ? "close"
                : "open"
            )
          }
          onToggleLock={() =>
            sendCommand(
              "door",
              doorLocked
                ? "unlock"
                : "lock"
            )
          }
        />
      )}

      {/* TV */}
      {activeDevice === "tv" && (
        <TVEmulator
          isOn={tvOn}
          volume={tvVolume}
          app={tvApp}
          onToggle={() =>
            sendCommand(
              "tv",
              tvOn
                ? "turn_off"
                : "turn_on"
            )
          }
          onVolumeChange={(
            value
          ) =>
            sendCommand(
              "tv",
              "set_volume",
              value
            )
          }
          onOpenApp={(action) =>
            sendCommand("tv", action)
          }
        />
      )}

      {/* SPEAKER */}
      {activeDevice ===
        "speaker" && (
        <SpeakerEmulator
          isOn={speakerOn}
          playing={speakerPlaying}
          volume={speakerVolume}
          app={speakerApp}
          onToggle={() =>
            sendCommand(
              "speaker",
              speakerOn
                ? "turn_off"
                : "turn_on"
            )
          }
          onPlayPause={() =>
            sendCommand(
              "speaker",
              speakerPlaying
                ? "pause"
                : "play"
            )
          }
          onVolumeChange={(
            value
          ) =>
            sendCommand(
              "speaker",
              "set_volume",
              value
            )
          }
          onOpenSpotify={() =>
            sendCommand(
              "speaker",
              "open_spotify"
            )
          }
        />
      )}
    </aside>
  );
}