const express = require("express");
const router = express.Router();
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  togglePin,
} = require("../controller/announcementController");

// GET /api/announcements
router.get("/announcements", getAllAnnouncements);
// GET /api/announcements/active
router.get("/announcements/active", getActiveAnnouncements);
// GET /api/announcements/:id
router.get("/announcements/:id", getAnnouncementById);
// POST /api/announcements
router.post("/announcements", createAnnouncement);
// PUT /api/announcements/:id
router.put("/announcements/:id", updateAnnouncement);
// PATCH /api/announcements/:id/pin
router.patch("/announcements/:id/pin", togglePin);
// DELETE /api/announcements/:id
router.delete("/announcements/:id", deleteAnnouncement);

module.exports = router;
