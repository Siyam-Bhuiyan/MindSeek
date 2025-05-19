const ChatMessage = require("../models/ChatMessage");
const multer = require("multer");
const path = require("path");
const { extractTextFromImage } = require("../utils/ocrUtils");
const { Groq } = require("groq-sdk");

// Initialize Groq client
const groq = new Groq();
groq.apiKey = process.env.GROQ_API_KEY;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads/chat/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb("Error: Only images and PDFs allowed!");
  },
}).single("file");

// Process chat message with streaming response
exports.processMessage = async (req, res) => {
  try {
    // Handle both GET and POST requests
    const content = req.method === "GET" ? req.query.message : req.body.content;
    let messageHistory = [];

    // Parse message history if it exists
    if (req.method === "POST" && req.body.messageHistory) {
      try {
        messageHistory = JSON.parse(req.body.messageHistory);
      } catch (error) {
        console.log("Failed to parse message history:", error);
        messageHistory = [];
      }
    }

    let fileData = {};    // Ensure authentication
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Process uploaded file if present
    if (req.file) {
      fileData.fileName = req.file.originalname;
      fileData.fileUrl = req.file.path;
      if (req.file.mimetype.startsWith("image/")) {
        fileData.extractedText = await extractTextFromImage(req.file.path);
      }
    }

    // Save user message
    const userMessage = new ChatMessage({
      userId: req.user._id,
      role: "user",
      content,
      fileData,
    });
    await userMessage.save();

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Prepare messages array for Groq
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI study assistant. Provide clear, accurate, and concise responses.",
      },
      ...messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: fileData.extractedText
          ? `Context from image: ${fileData.extractedText}\n\nUser question: ${content}`
          : content,
      },
    ];

    // Generate AI response using Groq with streaming
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    let assistantContent = "";

    // Stream the response
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      assistantContent += content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save AI response after streaming
    const aiMessage = new ChatMessage({
      userId: req.user._id,
      role: "assistant",
      content: assistantContent,
    });
    await aiMessage.save();

    res.end();
  } catch (error) {
    console.error("Chat processing error:", error);
    res.status(500).json({ message: "Failed to process chat message" });
  }
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};
