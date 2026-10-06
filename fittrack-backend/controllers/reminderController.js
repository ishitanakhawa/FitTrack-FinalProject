const User = require("../models/User");
const { messaging } = require("../config/firebase");

// PUT /api/users/fcm-token  (save the device token)
const saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: "fcmToken is required" });
    }

    await User.findByIdAndUpdate(req.user._id, { fcmToken });

    res.json({ message: "FCM token saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reminders/send  (send a workout reminder to the logged in user)
const sendReminder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.fcmToken) {
      return res
        .status(400)
        .json({
          message: "No FCM token saved. Call PUT /api/users/fcm-token first",
        });
    }

    const message = {
      token: user.fcmToken,
      notification: {
        title: "FitTrack Reminder",
        body: (req.body && req.body.message) || "Time for your workout!",
      },
    };

    const messageId = await messaging.send(message);

    res.json({ message: "Reminder sent", messageId });
  } catch (error) {
    // a fake or expired device token ends up here
    res
      .status(400)
      .json({ message: "Could not send reminder", reason: error.message });
  }
};

module.exports = { saveFcmToken, sendReminder };
