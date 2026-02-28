const Team = require("../models/teamModel");

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ teamName: 1 });
    res.status(200).json({ success: true, count: teams.length, teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createTeam = async (req, res) => {
  try {
    const existing = await Team.findOne({ teamName: req.body.teamName });
    if (existing) return res.status(400).json({ success: false, message: "Team with this name already exists" });
    const team = new Team(req.body);
    await team.save();
    res.status(201).json({ success: true, team });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, team });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateTeamStats = async (req, res) => {
  try {
    const { wins, losses, draws, totalMatches } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { wins, losses, draws, totalMatches },
      { new: true }
    );
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });
    res.status(200).json({ success: true, team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam, updateTeamStats };
