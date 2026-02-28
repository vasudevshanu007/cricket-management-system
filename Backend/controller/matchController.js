const Match = require("../models/matchModel");

const getAllMatches = async (req, res) => {
  try {
    const { status, matchType } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (matchType) filter.matchType = matchType;
    const matches = await Match.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, count: matches.length, matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, match });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json({ success: true, match });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, match });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, message: "Match deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateScore = async (req, res) => {
  try {
    const { homeTeamInnings, awayTeamInnings, result, status, playerOfMatch, winningMargin } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { homeTeamInnings, awayTeamInnings, result, status, playerOfMatch, winningMargin },
      { new: true }
    );
    if (!match) return res.status(404).json({ success: false, message: "Match not found" });
    res.status(200).json({ success: true, match });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getUpcomingMatches = async (req, res) => {
  try {
    const matches = await Match.find({ status: "Upcoming" }).sort({ date: 1 }).limit(10);
    res.status(200).json({ success: true, matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllMatches, getMatchById, createMatch, updateMatch, deleteMatch, updateScore, getUpcomingMatches };
