const Plan = require("../models/Plan");

// POST /api/plans  (create a plan)
const createPlan = async (req, res) => {
  try {
    const { title, description, category, durationWeeks, schedule } = req.body;

    const plan = await Plan.create({
      title,
      description,
      category,
      durationWeeks,
      schedule,
      createdBy: req.user._id,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/plans  (all plans)
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/plans/search?keyword=strength
const searchPlans = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({ message: "Please provide a keyword" });
    }

    // search in title, description and category (case insensitive)
    const plans = await Plan.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    }).populate("createdBy", "name email");

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/plans/:id
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("followers", "name");

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/plans/:id/follow
const followPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // check if the user already follows this plan
    const alreadyFollowing = plan.followers.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (alreadyFollowing) {
      return res.status(400).json({ message: "You already follow this plan" });
    }

    plan.followers.push(req.user._id);
    await plan.save();

    res.json({
      message: "You are now following this plan",
      followersCount: plan.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPlan, getPlans, searchPlans, getPlanById, followPlan };
