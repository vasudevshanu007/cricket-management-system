const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const playerSlotSchema = new mongoose.Schema({
  player: { type: ObjectId, ref: "User" },
  role: {
    type: String,
    enum: ["Batsman", "Bowler", "All-rounder", "Wicket-keeper", "Captain", "Vice-Captain"],
  },
  jerseyNumber: { type: Number },
});

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
      maxlength: 50,
    },
    teamCode: {
      type: String,
      required: [true, "Team code is required"],
      trim: true,
      maxlength: 5,
      uppercase: true,
    },
    homeGround: {
      type: String,
      trim: true,
    },
    founded: {
      type: Number,
    },
    coach: {
      type: String,
      trim: true,
    },
    captain: {
      type: String,
      trim: true,
    },
    viceCaptain: {
      type: String,
      trim: true,
    },
    players: [playerSlotSchema],
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    totalMatches: { type: Number, default: 0 },
    logoUrl: {
      type: String,
      trim: true,
    },
    primaryColor: {
      type: String,
      default: "#1a73e8",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Disbanded"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
