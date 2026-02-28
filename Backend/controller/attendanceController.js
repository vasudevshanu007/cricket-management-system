const Attendance = require("../models/attendanceModel");

const getAllAttendance = async (req, res) => {
  try {
    const { sessionType } = req.query;
    let filter = {};
    if (sessionType) filter.sessionType = sessionType;
    const records = await Attendance.find(filter).sort({ sessionDate: -1 });
    res.status(200).json({ success: true, count: records.length, records });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Attendance record not found" });
    res.status(200).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createAttendance = async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Attendance record not found" });
    Object.assign(record, req.body);
    await record.save(); // triggers pre-save to recount
    res.status(200).json({ success: true, record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Attendance record not found" });
    res.status(200).json({ success: true, message: "Attendance record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ sessionDate: -1 }).limit(20);
    const summary = {
      totalSessions: records.length,
      avgAttendanceRate: records.length > 0
        ? Math.round(records.reduce((acc, r) => acc + (r.totalCount > 0 ? (r.presentCount / r.totalCount) * 100 : 0), 0) / records.length)
        : 0,
      recentSessions: records.slice(0, 5),
    };
    res.status(200).json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getPlayerAttendance = async (req, res) => {
  try {
    const { email } = req.params;
    const allRecords = await Attendance.find({ "records.playerEmail": email });
    const playerRecords = allRecords.map(session => {
      const playerRecord = session.records.find(r => r.playerEmail === email);
      return {
        sessionName: session.sessionName,
        sessionType: session.sessionType,
        sessionDate: session.sessionDate,
        status: playerRecord ? playerRecord.status : "N/A",
      };
    });
    const present = playerRecords.filter(r => r.status === "Present").length;
    const total = playerRecords.length;
    res.status(200).json({ success: true, attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0, sessions: playerRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllAttendance, getAttendanceById, createAttendance, updateAttendance, deleteAttendance, getAttendanceSummary, getPlayerAttendance };
