const commandService = require("../service/commandService");

function getState(req, res) {
  try {
    const { sessionId } = req.query;

    const devices = commandService.getState(sessionId);

    res.json({
      success: true,
      devices,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

function manualCommand(req, res) {
  try {
    const {
      device,
      action,
      value,
      sessionId,
    } = req.body;

    const devices = commandService.applyCommand(
      device,
      action,
      value,
      sessionId
    );

    res.json({
      success: true,
      source: "manual",
      device,
      action,
      devices,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

function voiceCommand(req, res) {
  try {
    const {
      text,
      sessionId,
    } = req.body;

    const result = commandService.applyVoiceCommand(
      text,
      sessionId
    );

    res.json({
      success: true,
      source: "voice",
      text,
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

module.exports = {
  getState,
  manualCommand,
  voiceCommand,
};