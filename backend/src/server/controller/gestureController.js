const gestureService = require("../service/gestureService");

function gestureCommand(req, res) {
  try {
    const {
      gesture,
      sessionId,
    } = req.body;

    if (!gesture) {
      return res.status(400).json({
        success: false,
        message: "Gesture is required",
      });
    }

    const result = gestureService.applyGesture(
      gesture,
      sessionId
    );

    res.json({
      success: true,
      source: "gesture",
      gesture: result.gesture,
      command: result.command,
      devices: result.devices,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

function getGestures(req, res) {
  try {
    res.json({
      success: true,
      gestures: gestureService.getAvailableGestures(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  gestureCommand,
  getGestures,
};