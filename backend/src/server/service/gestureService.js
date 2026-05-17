const { applyCommand } = require("./commandService");
const gestureCommands = require("../data/gestureCommand.json");

function normalizeGesture(gesture) {
  return String(gesture || "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
}

function validateGestureCommands() {
  const seenGestures = new Set();

  for (const gestureName of Object.keys(gestureCommands)) {
    const normalizedName = normalizeGesture(gestureName);

    if (seenGestures.has(normalizedName)) {
      throw new Error(`Duplicate gesture detected: "${gestureName}"`);
    }

    seenGestures.add(normalizedName);
  }
}

validateGestureCommands();

function applyGesture(gesture, sessionId) {
  const gestureName = normalizeGesture(gesture);

  if (!gestureName) {
    throw new Error("Gesture is required");
  }

  const matchedGesture = gestureCommands[gestureName];

  if (!matchedGesture) {
    throw new Error(`Gesture not recognized: "${gestureName}"`);
  }

  const devices = applyCommand(
    matchedGesture.device,
    matchedGesture.action,
    null,
    sessionId
  );

  return {
    gesture: gestureName,
    command: matchedGesture,
    devices,
  };
}

function getAvailableGestures() {
  const gestures = Object.keys(gestureCommands).map((gestureName) => ({
    gesture: gestureName,
    device: gestureCommands[gestureName].device,
    action: gestureCommands[gestureName].action,
  }));

  return {
    count: gestures.length,
    gestures,
  };
}

module.exports = {
  applyGesture,
  getAvailableGestures,
};