const express = require("express");
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  updateTeamStats,
} = require("../controller/teamController");

// GET /api/teams
router.get("/teams", getAllTeams);
// GET /api/teams/:id
router.get("/teams/:id", getTeamById);
// POST /api/teams
router.post("/teams", createTeam);
// PUT /api/teams/:id
router.put("/teams/:id", updateTeam);
// PATCH /api/teams/:id/stats
router.patch("/teams/:id/stats", updateTeamStats);
// DELETE /api/teams/:id
router.delete("/teams/:id", deleteTeam);

module.exports = router;
