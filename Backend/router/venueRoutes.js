const express = require("express");
const router = express.Router();
const { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue, addBooking, removeBooking, getAvailableVenues } = require("../controller/venueController");

router.get("/venues", getAllVenues);
router.get("/venues/available", getAvailableVenues);
router.get("/venues/:id", getVenueById);
router.post("/venues", createVenue);
router.put("/venues/:id", updateVenue);
router.post("/venues/:id/bookings", addBooking);
router.delete("/venues/:id/bookings/:bookingId", removeBooking);
router.delete("/venues/:id", deleteVenue);

module.exports = router;
