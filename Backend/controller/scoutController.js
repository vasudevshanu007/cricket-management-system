const Scout = require("../models/scoutModel");

const getAllScouts = async (req, res) => {
  try {
    const { status, grade, recommendedFor } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (grade) filter.grade = grade;
    if (recommendedFor) filter.recommendedFor = recommendedFor;
    const scouts = await Scout.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: scouts.length, scouts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getScoutById = async (req, res) => {
  try {
    const scout = await Scout.findById(req.params.id);
    if (!scout) return res.status(404).json({ success: false, message: "Scout record not found" });
    res.status(200).json({ success: true, scout });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createScout = async (req, res) => {
  try {
    const scout = new Scout(req.body);
    await scout.save();
    res.status(201).json({ success: true, scout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateScout = async (req, res) => {
  try {
    const scout = await Scout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!scout) return res.status(404).json({ success: false, message: "Scout record not found" });
    res.status(200).json({ success: true, scout });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteScout = async (req, res) => {
  try {
    const scout = await Scout.findByIdAndDelete(req.params.id);
    if (!scout) return res.status(404).json({ success: false, message: "Scout record not found" });
    res.status(200).json({ success: true, message: "Scout record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, trialDate, notes } = req.body;
    const scout = await Scout.findByIdAndUpdate(req.params.id, { status, trialDate, notes }, { new: true });
    if (!scout) return res.status(404).json({ success: false, message: "Scout record not found" });
    res.status(200).json({ success: true, scout });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getShortlisted = async (req, res) => {
  try {
    const scouts = await Scout.find({ status: { $in: ["Shortlisted", "Trial Scheduled"] } }).sort({ grade: 1 });
    res.status(200).json({ success: true, count: scouts.length, scouts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllScouts, getScoutById, createScout, updateScout, deleteScout, updateStatus, getShortlisted };
