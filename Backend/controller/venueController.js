const Venue = require("../models/venueModel");

const getAllVenues = async (req, res) => {
  try {
    const { status, type } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const venues = await Venue.find(filter).sort({ name: 1 });
    res.status(200).json({ success: true, count: venues.length, venues });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    res.status(200).json({ success: true, venue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createVenue = async (req, res) => {
  try {
    const existing = await Venue.findOne({ name: req.body.name });
    if (existing) return res.status(400).json({ success: false, message: "Venue with this name already exists" });
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json({ success: true, venue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    res.status(200).json({ success: true, venue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    res.status(200).json({ success: true, message: "Venue deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const addBooking = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    venue.bookings.push(req.body);
    venue.status = "Booked";
    await venue.save();
    res.status(200).json({ success: true, venue });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const removeBooking = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });
    venue.bookings = venue.bookings.filter(b => b._id.toString() !== req.params.bookingId);
    if (venue.bookings.length === 0) venue.status = "Available";
    await venue.save();
    res.status(200).json({ success: true, venue });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAvailableVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ status: "Available" }).sort({ name: 1 });
    res.status(200).json({ success: true, venues });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue, addBooking, removeBooking, getAvailableVenues };
