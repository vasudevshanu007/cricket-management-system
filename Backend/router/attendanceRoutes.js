const express = require("express");
const router = express.Router();
const { getAllAttendance, getAttendanceById, createAttendance, updateAttendance, deleteAttendance, getAttendanceSummary, getPlayerAttendance } = require("../controller/attendanceController");

router.get("/attendance", getAllAttendance);
router.get("/attendance/summary", getAttendanceSummary);
router.get("/attendance/player/:email", getPlayerAttendance);
router.get("/attendance/:id", getAttendanceById);
router.post("/attendance", createAttendance);
router.put("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);

module.exports = router;
