const { analyzeResumeMatch } = require("../utils/aiService");
const Job = require("../models/Job");

// POST /api/ai/analyze
const analyzeJob = async (req, res) => {
  try {
    const { resume, jobId, provider } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!job.jobDescription) {
      return res
        .status(400)
        .json({ message: "Job description is required for AI analysis" });
    }

    const result = await analyzeResumeMatch(
      resume,
      job.jobDescription,
      provider || "claude"
    );

    job.aiScore = result.score;
    job.aiFeedback = result.feedback;
    await job.save();

    res.json({
      score: result.score,
      feedback: result.feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeJob };
