const Contract = require("../models/contractModel");

const getAllContracts = async (req, res) => {
  try {
    const { status, contractType } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (contractType) filter.contractType = contractType;
    const contracts = await Contract.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contracts.length, contracts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });
    res.status(200).json({ success: true, contract });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createContract = async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json({ success: true, contract });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });
    res.status(200).json({ success: true, contract });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });
    res.status(200).json({ success: true, message: "Contract deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getExpiringContracts = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    const contracts = await Contract.find({
      endDate: { $gte: today, $lte: thirtyDaysLater },
      status: "Active",
    }).sort({ endDate: 1 });
    res.status(200).json({ success: true, count: contracts.length, contracts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getContractsByPlayer = async (req, res) => {
  try {
    const contracts = await Contract.find({ playerEmail: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, contracts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getAllContracts, getContractById, createContract, updateContract, deleteContract, getExpiringContracts, getContractsByPlayer };
