const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticateUser } = require("../middleware/auth");

// Protected routes - require authentication
router.use(authenticateUser);

// Process chat message with streaming response
router.post("/stream", chatController.upload, chatController.processMessage);

// Handle streaming GET requests (for SSE)
router.get("/stream", chatController.processMessage);

// Get chat history
router.get("/history", chatController.getChatHistory);

module.exports = router;
