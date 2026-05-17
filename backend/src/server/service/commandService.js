const initialDevices = require("../data/devices.json");
const voiceCommands = require("../data/voiceCommands.json");

const userDevices = {};

function cloneInitialDevices() {
  return JSON.parse(JSON.stringify(initialDevices));
}

function normalizeSessionId(sessionId) {
  return String(sessionId || "").trim();
}

function getUserDevices(sessionId) {
  const id = normalizeSessionId(sessionId);

  if (!id) {
    throw new Error("Session ID is required");
  }

  if (!userDevices[id]) {
    userDevices[id] = cloneInitialDevices();
  }

  return userDevices[id];
}

function getState(sessionId) {
  return getUserDevices(sessionId);
}

function applyCommand(device, action, value = null, sessionId, options = {}) {
  const devices = getUserDevices(sessionId);

  if (!devices[device]) {
    throw new Error("Invalid device");
  }

  const dev = devices[device];

  switch (device) {
    case "light":
      if (action === "turn_on") {
        dev.on = true;
        dev.mode = "normal";
      }

      if (action === "turn_off") {
        dev.on = false;
        dev.mode = "normal";
        dev.disco = false;
      }

      if (action === "toggle") {
        dev.on = !dev.on;
        if (!dev.on) {
          dev.mode = "normal";
          dev.disco = false;
        }
      }

      if (action === "brightness_up") {
        dev.on = true;
        dev.brightness = Math.min(100, dev.brightness + 10);
      }

      if (action === "brightness_down") {
        dev.brightness = Math.max(0, dev.brightness - 10);
      }

      if (action === "set_brightness") {
        dev.brightness = Math.max(0, Math.min(100, Number(value)));
      }

      if (action === "open_disco") {
        dev.on = true;
        dev.mode = "disco";
        dev.disco = true;
        dev.brightness = 100;
      }

      if (action === "close_disco") {
        dev.mode = "normal";
        dev.disco = false;
      }

      break;

    case "door":
      if (action === "open") {
        if (dev.locked) {
          throw new Error("Door is locked");
        }

        dev.open = true;
      }

      if (action === "close") {
        dev.open = false;
      }

      if (action === "lock") {
        if (dev.open) {
          throw new Error("Close the door before locking");
        }

        dev.locked = true;
      }

      if (action === "unlock") {
        dev.locked = false;
      }

      break;

    case "tv":
      if (action === "turn_on") dev.on = true;

      if (action === "turn_off") {
        dev.on = false;
        dev.app = "home";
      }

      if (action === "toggle") dev.on = !dev.on;

      if (action === "volume_up") {
        dev.on = true;
        dev.volume = Math.min(100, dev.volume + 10);
      }

      if (action === "volume_down") {
        dev.volume = Math.max(0, dev.volume - 10);
      }

      if (action === "set_volume") {
        dev.volume = Math.max(0, Math.min(100, Number(value)));
      }

      if (action === "open_youtube") {
        dev.on = true;
        dev.app = "youtube";
      }

      if (action === "open_netflix") {
        dev.on = true;
        dev.app = "netflix";
      }

      if (action === "open_disney") {
        dev.on = true;
        dev.app = "disney";
      }

      if (action === "go_home") {
        dev.on = true;
        dev.app = "home";
      }

      break;

    case "speaker":
      if (action === "turn_on") dev.on = true;

      if (action === "turn_off") {
        dev.on = false;
        dev.playing = false;
      }

      if (action === "play") {
        dev.on = true;
        dev.playing = true;
      }

      if (action === "pause") {
        dev.playing = false;
      }

      if (action === "volume_up") {
        dev.on = true;
        dev.volume = Math.min(100, dev.volume + 10);
      }

      if (action === "volume_down") {
        dev.volume = Math.max(0, dev.volume - 10);
      }

      if (action === "set_volume") {
        dev.volume = Math.max(0, Math.min(100, Number(value)));
      }

      if (action === "open_spotify") {
        dev.on = true;
        dev.playing = true;
        dev.app = "spotify";

        if (!dev.track) {
          dev.track = "Demo Music";
        }

        if (!dev.src) {
          dev.src = "/audio/Bruno_Mars.mp3";
        }
      }

      if (action === "play_artist") {
        dev.on = true;
        dev.playing = true;
        dev.app = "spotify";
        dev.track = options.artist || "Selected Song";
        dev.artist = options.artist || "Unknown Artist";
        dev.src = options.src || dev.src || "/audio/Bruno_Mars.mp3";
      }

      break;

    default:
      throw new Error("Unsupported device");
  }

  return devices;
}

function applyVoiceCommand(text, sessionId) {
  const commandText = String(text || "").toLowerCase().trim();
  const matchedCommand = voiceCommands[commandText];

  if (!matchedCommand) {
    throw new Error("Voice command not recognized");
  }

  const devices = applyCommand(
    matchedCommand.device,
    matchedCommand.action,
    null,
    sessionId,
    {
      artist: matchedCommand.artist,
      src: matchedCommand.src,
    }
  );

  return {
    command: matchedCommand,
    devices,
  };
}

module.exports = {
  getState,
  applyCommand,
  applyVoiceCommand,
};