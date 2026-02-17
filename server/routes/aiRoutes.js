const express = require("express");
const router = express.Router();
const { analyzeJob } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/analyze", protect, upload.single("resume"), analyzeJob);

module.exports = router;
