const express = require("express");
const router = express.Router();
const { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan, updateProgress, getActivePlans } = require("../controller/fitnessPlanController");

router.get("/fitness", getAllPlans);
router.get("/fitness/active", getActivePlans);
router.get("/fitness/:id", getPlanById);
router.post("/fitness", createPlan);
router.put("/fitness/:id", updatePlan);
router.patch("/fitness/:id/progress", updateProgress);
router.delete("/fitness/:id", deletePlan);

module.exports = router;
