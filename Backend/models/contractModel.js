const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const contractSchema = new mongoose.Schema(
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
    contractType: {
      type: String,
      required: [true, "Contract type is required"],
      enum: ["Full-time", "Part-time", "Trial", "Academy", "International"],
    },
    position: {
      type: String,
      enum: ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    baseSalary: {
      type: Number,
      required: [true, "Base salary is required"],
      min: 0,
    },
    signingBonus: {
      type: Number,
      default: 0,
      min: 0,
    },
    performanceBonus: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "LKR",
      enum: ["LKR", "USD", "GBP", "AUD", "INR"],
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Terminated", "Pending", "Under Review"],
      default: "Pending",
    },
    renewalEligible: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    agentName: {
      type: String,
      trim: true,
    },
    agentContact: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate total contract value
contractSchema.pre("save", function (next) {
  this.totalValue = this.baseSalary + this.signingBonus + this.performanceBonus;
  next();
});

module.exports = mongoose.model("Contract", contractSchema);
