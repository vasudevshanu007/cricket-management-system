const FitnessPlan = require("../models/fitnessPlanModel");

const getAllPlans = async (req, res) => {
  try {
    const { status, planType, playerEmail } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (planType) filter.planType = planType;
    if (playerEmail) filter.playerEmail = playerEmail;
    const plans = await FitnessPlan.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: plans.length, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Fitness plan not found" });
    res.status(200).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createPlan = async (req, res) => {
  try {
    const plan = new FitnessPlan(req.body);
    await plan.save();
    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await FitnessPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: "Fitness plan not found" });
    res.status(200).json({ success: true, plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await FitnessPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Fitness plan not found" });
    res.status(200).json({ success: true, message: "Fitness plan deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { completionPercentage, progressNotes, status } = req.body;
    const plan = await FitnessPlan.findByIdAndUpdate(req.params.id, { completionPercentage, progressNotes, status }, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: "Fitness plan not found" });
    res.status(200).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getActivePlans = async (req, res) => {
  try {
    const plans = await FitnessPlan.find({ status: "Active" }).sort({ endDate: 1 });
    res.status(200).json({ success: true, count: plans.length, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan, updateProgress, getActivePlans };
