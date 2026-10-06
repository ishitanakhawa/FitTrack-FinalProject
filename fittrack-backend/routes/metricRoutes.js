const express = require("express");
const router = express.Router();
const {
  addMetric,
  getUserMetrics,
  uploadProgressPhoto,
} = require("../controllers/metricController");
const { protect } = require("../middleware/authMiddleware");
const { protectAny } = require("../middleware/firebaseAuth");
const { metricRules } = require("../middleware/validateMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, metricRules, addMetric);
router.get("/user/:id", protect, getUserMetrics);
router.post(
  "/:id/photo",
  protectAny,
  upload.single("photo"),
  uploadProgressPhoto,
);

module.exports = router;
