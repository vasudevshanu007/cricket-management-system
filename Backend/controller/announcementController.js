const Announcement = require("../models/announcementModel");

const getAllAnnouncements = async (req, res) => {
  try {
    const { category, priority, targetAudience, isActive } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    // Exclude expired announcements
    filter.$or = [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }];

    const announcements = await Announcement.find(filter).sort({ isPinned: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json({ success: true, announcement });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, announcement });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found" });
    res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    }).sort({ isPinned: -1, priority: -1, createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const togglePin = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ success: false, message: "Announcement not found" });
    announcement.isPinned = !announcement.isPinned;
    await announcement.save();
    res.status(200).json({ success: true, announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, getActiveAnnouncements, togglePin };
