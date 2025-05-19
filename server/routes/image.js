const express = require("express");
const router = express.Router();
const { generateImage } = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

// Public route for image generation
router.post("/generate", generateImage);

module.exports = router;
