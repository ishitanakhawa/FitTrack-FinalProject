const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String, // example: strength, cardio, yoga
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    caloriesBurned: {
      type: Number,
    },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
        weight: Number, // in kg
      },
    ],
    personalRecord: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Workout", workoutSchema);
