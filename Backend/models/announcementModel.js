const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, "Announcement content is required"],
      trim: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["General", "Match", "Training", "Medical", "Financial", "Selection", "Recruitment", "Other"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    targetAudience: {
      type: String,
      enum: ["All", "Players", "Coaches", "Staff", "Admin"],
      default: "All",
    },
    authorName: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    attachmentUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
