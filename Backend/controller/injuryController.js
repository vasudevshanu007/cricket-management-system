const Injury = require("../models/injuryModel");

const getAllInjuries = async (req, res) => {
  try {
    const { status, severity } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const injuries = await Injury.find(filter).sort({ injuryDate: -1 });
    res.status(200).json({ success: true, count: injuries.length, injuries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getInjuryById = async (req, res) => {
  try {
    const injury = await Injury.findById(req.params.id);
    if (!injury) return res.status(404).json({ success: false, message: "Injury record not found" });
    res.status(200).json({ success: true, injury });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createInjury = async (req, res) => {
  try {
    const injury = new Injury(req.body);
    await injury.save();
    res.status(201).json({ success: true, injury });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateInjury = async (req, res) => {
  try {
    const injury = await Injury.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!injury) return res.status(404).json({ success: false, message: "Injury record not found" });
    res.status(200).json({ success: true, injury });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteInjury = async (req, res) => {
  try {
    const injury = await Injury.findByIdAndDelete(req.params.id);
    if (!injury) return res.status(404).json({ success: false, message: "Injury record not found" });
    res.status(200).json({ success: true, message: "Injury record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getActiveInjuries = async (req, res) => {
  try {
    const injuries = await Injury.find({ status: { $in: ["Injured", "Recovering"] } }).sort({ injuryDate: -1 });
    res.status(200).json({ success: true, count: injuries.length, injuries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateFitnessStatus = async (req, res) => {
  try {
    const { status, actualRecoveryDate, availableForSelection } = req.body;
    const injury = await Injury.findByIdAndUpdate(
      req.params.id,
      { status, actualRecoveryDate, availableForSelection },
      { new: true }
    );
    if (!injury) return res.status(404).json({ success: false, message: "Injury record not found" });
    res.status(200).json({ success: true, injury });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllInjuries, getInjuryById, createInjury, updateInjury, deleteInjury, getActiveInjuries, updateFitnessStatus };
