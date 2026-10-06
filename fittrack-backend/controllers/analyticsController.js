const Workout = require("../models/Workout");
const Metric = require("../models/Metric");

// GET /api/analytics/summary?period=weekly or monthly
const getSummary = async (req, res) => {
  try {
    const period = req.query.period || "weekly";

    if (period !== "weekly" && period !== "monthly") {
      return res
        .status(400)
        .json({ message: "period must be weekly or monthly" });
    }

    // weekly = last 7 days, monthly = last 30 days
    const days = period === "weekly" ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // get this user's workouts in that time
    const workouts = await Workout.find({
      user: req.user._id,
      date: { $gte: startDate },
    });

    let totalMinutes = 0;
    let totalCalories = 0;
    let personalRecords = 0;
    const byType = {};

    workouts.forEach((w) => {
      totalMinutes += w.duration || 0;
      totalCalories += w.caloriesBurned || 0;

      if (w.personalRecord) {
        personalRecords++;
      }

      // count workouts for each type (cardio, strength...)
      byType[w.type] = (byType[w.type] || 0) + 1;
    });

    // latest weight and BMI
    const latestMetric = await Metric.findOne({ user: req.user._id }).sort({
      date: -1,
    });

    res.json({
      period,
      from: startDate,
      to: new Date(),
      totalWorkouts: workouts.length,
      totalMinutes,
      totalCalories,
      personalRecords,
      workoutsByType: byType,
      latestWeight: latestMetric ? latestMetric.weight : null,
      latestBmi: latestMetric ? latestMetric.bmi : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary };
