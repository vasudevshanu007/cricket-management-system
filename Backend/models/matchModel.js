const mongoose = require("mongoose");

const inningsSchema = new mongoose.Schema({
  team: { type: String },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  extras: { type: Number, default: 0 },
});

const matchSchema = new mongoose.Schema(
  {
    matchTitle: {
      type: String,
      required: [true, "Match title is required"],
      trim: true,
      maxlength: 100,
    },
    matchType: {
      type: String,
      required: [true, "Match type is required"],
      enum: ["T20", "ODI", "Test", "T10", "Practice", "Friendly"],
    },
    date: {
      type: Date,
      required: [true, "Match date is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    homeTeam: {
      type: String,
      required: [true, "Home team is required"],
      trim: true,
    },
    awayTeam: {
      type: String,
      required: [true, "Away team is required"],
      trim: true,
    },
    homeTeamInnings: inningsSchema,
    awayTeamInnings: inningsSchema,
    result: {
      type: String,
      enum: ["Home Team Won", "Away Team Won", "Draw", "Tie", "No Result", "Abandoned", "Pending"],
      default: "Pending",
    },
    winningMargin: {
      type: String,
      trim: true,
    },
    playerOfMatch: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Live", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    tournament: {
      type: String,
      trim: true,
    },
    umpire1: { type: String, trim: true },
    umpire2: { type: String, trim: true },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
