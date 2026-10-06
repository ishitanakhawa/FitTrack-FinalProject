const express = require("express");
const router = express.Router();
const { saveFcmToken } = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

router.put("/fcm-token", protect, saveFcmToken);

module.exports = router;
