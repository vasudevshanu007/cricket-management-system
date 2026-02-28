const express = require("express");
const router = express.Router();
const {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  updateScore,
  getUpcomingMatches,
} = require("../controller/matchController");

// GET /api/matches
router.get("/matches", getAllMatches);
// GET /api/matches/upcoming
router.get("/matches/upcoming", getUpcomingMatches);
// GET /api/matches/:id
router.get("/matches/:id", getMatchById);
// POST /api/matches
router.post("/matches", createMatch);
// PUT /api/matches/:id
router.put("/matches/:id", updateMatch);
// PATCH /api/matches/:id/score
router.patch("/matches/:id/score", updateScore);
// DELETE /api/matches/:id
router.delete("/matches/:id", deleteMatch);

module.exports = router;
