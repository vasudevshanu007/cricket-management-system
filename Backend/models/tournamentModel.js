const mongoose = require("mongoose");

const standingSchema = new mongoose.Schema({
  teamName: { type: String },
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  drawn: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  nrr: { type: Number, default: 0 },
  runsFor: { type: Number, default: 0 },
  runsAgainst: { type: Number, default: 0 },
});

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tournament name is required"],
      trim: true,
      maxlength: 100,
    },
    edition: {
      type: String,
      trim: true,
    },
    format: {
      type: String,
      required: [true, "Format is required"],
      enum: ["League", "Knockout", "Mixed (League + Knockout)", "Round Robin", "Double Elimination"],
    },
    matchType: {
      type: String,
      required: [true, "Match type is required"],
      enum: ["T20", "ODI", "Test", "T10", "Mixed"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    venue: {
      type: String,
      trim: true,
    },
    teams: [{ type: String, trim: true }],
    standings: [standingSchema],
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    winner: {
      type: String,
      trim: true,
    },
    runnerUp: {
      type: String,
      trim: true,
    },
    prizePool: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "LKR",
    },
    organizer: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
