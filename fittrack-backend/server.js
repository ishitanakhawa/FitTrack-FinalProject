const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");


const app = express();

// connect to database
connectDB();
require("./config/firebase");
// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/metrics", require("./routes/metricRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("FitTrack API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
