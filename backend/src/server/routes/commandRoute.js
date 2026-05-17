const express = require("express");
const router = express.Router();

const commandController = require("../controller/commandController");

router.get("/state", commandController.getState);
router.post("/command", commandController.manualCommand);
router.post("/voice-command", commandController.voiceCommand);

module.exports = router;