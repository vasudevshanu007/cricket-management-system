const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  playerName: { type: String, required: true, trim: true },
  playerEmail: { type: String, trim: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Excused"],
    default: "Present",
  },
  notes: { type: String, trim: true },
});

const attendanceSchema = new mongoose.Schema(
  {
    sessionName: { type: String, required: [true, "Session name is required"], trim: true },
    sessionType: {
      type: String,
      required: true,
      enum: ["Practice", "Match", "Fitness", "Meeting", "Tournament", "Other"],
    },
    sessionDate: { type: Date, required: [true, "Session date is required"] },
    venue: { type: String, trim: true },
    markedBy: { type: String, trim: true },
    records: [attendanceRecordSchema],
    presentCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
    lateCount: { type: Number, default: 0 },
    excusedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Auto-compute counts before saving
attendanceSchema.pre("save", function (next) {
  this.presentCount = this.records.filter(r => r.status === "Present").length;
  this.absentCount = this.records.filter(r => r.status === "Absent").length;
  this.lateCount = this.records.filter(r => r.status === "Late").length;
  this.excusedCount = this.records.filter(r => r.status === "Excused").length;
  this.totalCount = this.records.length;
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
