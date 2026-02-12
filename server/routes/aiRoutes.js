const express = require("express");
const router = express.Router();
const { analyzeJob } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/analyze", protect, analyzeJob);

module.exports = router;
