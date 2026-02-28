const express = require("express");
const router = express.Router();
const { getAllScouts, getScoutById, createScout, updateScout, deleteScout, updateStatus, getShortlisted } = require("../controller/scoutController");

router.get("/scouts", getAllScouts);
router.get("/scouts/shortlisted", getShortlisted);
router.get("/scouts/:id", getScoutById);
router.post("/scouts", createScout);
router.put("/scouts/:id", updateScout);
router.patch("/scouts/:id/status", updateStatus);
router.delete("/scouts/:id", deleteScout);

module.exports = router;
