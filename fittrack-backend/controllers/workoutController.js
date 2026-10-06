const Workout = require("../models/Workout");

// POST /api/workouts  (log a workout)
const createWorkout = async (req, res) => {
  try {
    const {
      title,
      type,
      duration,
      caloriesBurned,
      exercises,
      personalRecord,
      date,
    } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      title,
      type,
      duration,
      caloriesBurned,
      exercises,
      personalRecord,
      date,
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts  (all workouts of the logged in user)
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workouts/:id
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // make sure this workout belongs to the logged in user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to view this workout" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/workouts/:id
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this workout" });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workouts/:id
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this workout" });
    }

    await workout.deleteOne();

    res.json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
};
