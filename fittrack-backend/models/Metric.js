const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number, // in kg
      required: true,
    },
    height: {
      type: Number, // in cm
      required: true,
    },
    bmi: {
      type: Number,
    },
    photoUrl: {
      type: String, // Firebase Storage link for progress photo
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Metric", metricSchema);
