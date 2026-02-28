const express = require("express");
const router = express.Router();
const {
  getAllInjuries,
  getInjuryById,
  createInjury,
  updateInjury,
  deleteInjury,
  getActiveInjuries,
  updateFitnessStatus,
} = require("../controller/injuryController");

// GET /api/injuries
router.get("/injuries", getAllInjuries);
// GET /api/injuries/active
router.get("/injuries/active", getActiveInjuries);
// GET /api/injuries/:id
router.get("/injuries/:id", getInjuryById);
// POST /api/injuries
router.post("/injuries", createInjury);
// PUT /api/injuries/:id
router.put("/injuries/:id", updateInjury);
// PATCH /api/injuries/:id/fitness
router.patch("/injuries/:id/fitness", updateFitnessStatus);
// DELETE /api/injuries/:id
router.delete("/injuries/:id", deleteInjury);

module.exports = router;
