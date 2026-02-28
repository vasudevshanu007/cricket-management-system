const Tournament = require("../models/tournamentModel");

const getAllTournaments = async (req, res) => {
  try {
    const { status, format, matchType } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (format) filter.format = format;
    if (matchType) filter.matchType = matchType;
    const tournaments = await Tournament.find(filter).sort({ startDate: -1 });
    res.status(200).json({ success: true, count: tournaments.length, tournaments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ success: false, message: "Tournament not found" });
    res.status(200).json({ success: true, tournament });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json({ success: true, tournament });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tournament) return res.status(404).json({ success: false, message: "Tournament not found" });
    res.status(200).json({ success: true, tournament });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) return res.status(404).json({ success: false, message: "Tournament not found" });
    res.status(200).json({ success: true, message: "Tournament deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateStandings = async (req, res) => {
  try {
    const { standings } = req.body;
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { standings },
      { new: true }
    );
    if (!tournament) return res.status(404).json({ success: false, message: "Tournament not found" });
    res.status(200).json({ success: true, tournament });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getOngoingTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ status: "Ongoing" }).sort({ startDate: -1 });
    res.status(200).json({ success: true, tournaments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllTournaments, getTournamentById, createTournament, updateTournament, deleteTournament, updateStandings, getOngoingTournaments };
