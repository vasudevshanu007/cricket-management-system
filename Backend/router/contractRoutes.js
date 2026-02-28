const express = require("express");
const router = express.Router();
const {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  getExpiringContracts,
  getContractsByPlayer,
} = require("../controller/contractController");

// GET /api/contracts
router.get("/contracts", getAllContracts);
// GET /api/contracts/expiring
router.get("/contracts/expiring", getExpiringContracts);
// GET /api/contracts/player/:email
router.get("/contracts/player/:email", getContractsByPlayer);
// GET /api/contracts/:id
router.get("/contracts/:id", getContractById);
// POST /api/contracts
router.post("/contracts", createContract);
// PUT /api/contracts/:id
router.put("/contracts/:id", updateContract);
// DELETE /api/contracts/:id
router.delete("/contracts/:id", deleteContract);

module.exports = router;
