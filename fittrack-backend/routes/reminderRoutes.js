const express = require("express");
const router = express.Router();
const { sendReminder } = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send", protect, sendReminder);

module.exports = router;
