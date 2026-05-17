const express = require("express");
const router = express.Router();

const gestureController = require("../controller/gestureController");

router.post("/gesture", gestureController.gestureCommand);
router.get("/gestures", gestureController.getGestures);

module.exports = router;