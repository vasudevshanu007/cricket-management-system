const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const injurySchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
    },
    playerEmail: {
      type: String,
      trim: true,
    },
    playerId: {
      type: String,
      trim: true,
    },
    injuryType: {
      type: String,
      required: [true, "Injury type is required"],
      enum: [
        "Muscle Strain",
        "Fracture",
        "Sprain",
        "Dislocation",
        "Contusion",
        "Tendinitis",
        "Stress Fracture",
        "Ligament Tear",
        "Hamstring",
        "Back Injury",
        "Shoulder Injury",
        "Knee Injury",
        "Ankle Injury",
        "Wrist Injury",
        "Concussion",
        "Other",
      ],
    },
    bodyPart: {
      type: String,
      required: [true, "Body part is required"],
      trim: true,
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: ["Minor", "Moderate", "Severe", "Career-threatening"],
    },
    injuryDate: {
      type: Date,
      required: [true, "Injury date is required"],
    },
    expectedRecoveryDate: {
      type: Date,
    },
    actualRecoveryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Injured", "Recovering", "Fit", "Under Observation"],
      default: "Injured",
    },
    doctor: {
      type: String,
      trim: true,
    },
    hospital: {
      type: String,
      trim: true,
    },
    treatment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    missedMatches: {
      type: Number,
      default: 0,
    },
    availableForSelection: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Injury", injurySchema);
