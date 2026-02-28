const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["Practice", "Match", "Tournament", "Fitness", "Meeting", "Other"],
    default: "Practice",
  },
  bookedBy: { type: String, trim: true },
  teamOrGroup: { type: String, trim: true },
  notes: { type: String, trim: true },
});

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Venue name is required"], trim: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["Main Ground", "Practice Ground", "Indoor Net", "Gymnasium", "Swimming Pool", "Conference Room", "Other"],
    },
    capacity: { type: Number, default: 0 },
    location: { type: String, trim: true },
    facilities: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["Available", "Booked", "Under Maintenance", "Closed"],
      default: "Available",
    },
    contactPerson: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    rentalCostPerHour: { type: Number, default: 0 },
    description: { type: String, trim: true, maxlength: 500 },
    bookings: [bookingSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);
