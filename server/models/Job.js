const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: String,
    required: [true, "Please add a company name"],
  },
  position: {
    type: String,
    required: [true, "Please add a position"],
  },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected"],
    default: "Applied",
  },
  jobDescription: {
    type: String,
    default: "",
  },
  aiScore: {
    type: Number,
    default: null,
  },
  aiFeedback: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
