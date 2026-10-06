const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    height: {
      type: Number, // in cm, needed to calculate BMI
    },
    firebaseUid: {
      type: String, // used later for Firebase Auth
    },
    fcmToken: {
      type: String, // used later for reminder notifications
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
