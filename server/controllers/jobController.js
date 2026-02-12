const Job = require("../models/Job");

// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { company, position, status, jobDescription, notes, appliedDate } =
      req.body;

    const job = await Job.create({
      user: req.user._id,
      company,
      position,
      status,
      jobDescription,
      notes,
      appliedDate,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/:id
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, getJob, updateJob, deleteJob };
