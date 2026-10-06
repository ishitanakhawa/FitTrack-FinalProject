const Metric = require("../models/Metric");
const savePhoto = require("../utils/uploadPhoto");

// POST /api/metrics  (add weight and height, BMI is calculated here)
const addMetric = async (req, res) => {
  try {
    const { weight, height, date } = req.body;

    // BMI = weight (kg) / height (m) squared
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    const metric = await Metric.create({
      user: req.user._id,
      weight,
      height,
      bmi: Number(bmi.toFixed(1)),
      date,
    });

    res.status(201).json(metric);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/metrics/user/:id  (all metrics of a user, oldest first)
const getUserMetrics = async (req, res) => {
  try {
    // a user can only view their own metrics
    if (req.params.id !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to view these metrics" });
    }

    const metrics = await Metric.find({ user: req.params.id }).sort({
      date: 1,
    });

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// POST /api/metrics/:id/photo  (upload a progress photo)
const uploadProgressPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image in the "photo" field' });
    }

    const metric = await Metric.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({ message: 'Metric not found' });
    }

    if (metric.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to add a photo to this metric' });
    }

    metric.photoUrl = await savePhoto(req.file, req);
    await metric.save();

    res.json(metric);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { addMetric, getUserMetrics, uploadProgressPhoto };
