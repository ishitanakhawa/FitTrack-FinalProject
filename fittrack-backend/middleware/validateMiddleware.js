const { body, validationResult } = require("express-validator");

// checks if any validation rule failed
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidation,
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

const workoutRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("duration").isNumeric().withMessage("Duration must be a number"),
  handleValidation,
];

const planRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("category").notEmpty().withMessage("Category is required"),
  handleValidation,
];

const metricRules = [
  body("weight").isNumeric().withMessage("Weight must be a number"),
  body("height").isNumeric().withMessage("Height must be a number"),
  handleValidation,
];

module.exports = {
  registerRules,
  loginRules,
  workoutRules,
  planRules,
  metricRules,
};
