const express = require("express");
const router = express.Router();
const {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  updateStandings,
  getOngoingTournaments,
} = require("../controller/tournamentController");

// GET /api/tournaments
router.get("/tournaments", getAllTournaments);
// GET /api/tournaments/ongoing
router.get("/tournaments/ongoing", getOngoingTournaments);
// GET /api/tournaments/:id
router.get("/tournaments/:id", getTournamentById);
// POST /api/tournaments
router.post("/tournaments", createTournament);
// PUT /api/tournaments/:id
router.put("/tournaments/:id", updateTournament);
// PATCH /api/tournaments/:id/standings
router.patch("/tournaments/:id/standings", updateStandings);
// DELETE /api/tournaments/:id
router.delete("/tournaments/:id", deleteTournament);

module.exports = router;
