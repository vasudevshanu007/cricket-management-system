const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  sets: { type: Number },
  reps: { type: Number },
  duration: { type: String, trim: true },
  frequency: { type: String, trim: true },
  notes: { type: String, trim: true },
});

const fitnessPlanSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: [true, "Player name is required"], trim: true },
    playerEmail: { type: String, trim: true },
    planType: {
      type: String,
      required: true,
      enum: ["Fitness", "Nutrition", "Rehabilitation", "Pre-Season", "In-Season", "Off-Season", "Combined"],
    },
    createdBy: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold", "Cancelled"],
      default: "Active",
    },
    fitnessGoal: { type: String, trim: true, maxlength: 300 },
    currentFitnessLevel: {
      type: String,
      enum: ["Poor", "Below Average", "Average", "Good", "Excellent"],
    },
    targetFitnessLevel: {
      type: String,
      enum: ["Poor", "Below Average", "Average", "Good", "Excellent"],
    },
    weight: { type: Number },
    targetWeight: { type: Number },
    bmi: { type: Number },
    exercises: [exerciseSchema],
    // Nutrition
    dailyCalories: { type: Number },
    proteinGrams: { type: Number },
    carbsGrams: { type: Number },
    fatsGrams: { type: Number },
    specialDiet: { type: String, trim: true },
    dietaryRestrictions: { type: String, trim: true },
    hydrationLiters: { type: Number },
    // Progress
    progressNotes: { type: String, trim: true, maxlength: 1000 },
    nextReviewDate: { type: Date },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FitnessPlan", fitnessPlanSchema);
