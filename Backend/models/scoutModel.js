const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: [true, "Player name is required"], trim: true },
    age: { type: Number, required: [true, "Age is required"], min: 10, max: 50 },
    contactNumber: { type: String, trim: true },
    email: { type: String, trim: true },
    location: { type: String, trim: true },
    battingStyle: { type: String, enum: ["Right-handed", "Left-handed", "N/A"], default: "Right-handed" },
    bowlingStyle: { type: String, enum: ["Right-arm Fast", "Right-arm Medium", "Right-arm Spin", "Left-arm Fast", "Left-arm Medium", "Left-arm Spin", "N/A"], default: "N/A" },
    preferredPosition: { type: String, enum: ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"], default: "Batsman" },
    scoutedBy: { type: String, trim: true },
    scoutingDate: { type: Date, default: Date.now },
    grade: { type: String, enum: ["A", "B", "C", "D"], default: "C" },
    status: {
      type: String,
      enum: ["New", "Under Review", "Shortlisted", "Trial Scheduled", "Rejected", "Contracted"],
      default: "New",
    },
    recommendedFor: {
      type: String,
      enum: ["First Team", "U19", "U16", "Academy", "Reserves", "Support Staff"],
      default: "Academy",
    },
    strengths: { type: String, trim: true, maxlength: 500 },
    weaknesses: { type: String, trim: true, maxlength: 500 },
    overallRating: { type: Number, min: 1, max: 10 },
    trialDate: { type: Date },
    videoUrl: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scout", scoutSchema);
