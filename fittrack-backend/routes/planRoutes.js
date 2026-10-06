const express = require("express");
const router = express.Router();
const {
  createPlan,
  getPlans,
  searchPlans,
  getPlanById,
  followPlan,
} = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");
const { planRules } = require("../middleware/validateMiddleware");

router.post("/", protect, planRules, createPlan);
router.get("/", protect, getPlans);
router.get("/search", protect, searchPlans); // must be above /:id
router.get("/:id", protect, getPlanById);
router.post("/:id/follow", protect, followPlan);

module.exports = router;
