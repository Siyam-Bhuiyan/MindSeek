const ChatMessage = require('../models/ChatMessage');
const multer = require('multer');
const path = require('path');
const { extractTextFromImage } = require('../utils/ocrUtils');
const { Groq } = require('groq-sdk');

// Initialize Groq client
const groq = new Groq();
groq.apiKey = process.env.GROQ_API_KEY;

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: './uploads/chat/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

exports.upload = multer({
    storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb('Error: Only images, PDFs, and documents allowed!');
    }
}).single('file');

// Process chat message with file and voice input
exports.processMessage = async (req, res) => {
    try {
        const { content, type } = req.body;
        let fileData = {};
        let contextData = {};

        // Process uploaded file if present
        if (req.file) {
            fileData.fileName = req.file.originalname;
            fileData.fileUrl = req.file.path;

            // Extract text from image using Tesseract
            if (req.file.mimetype.startsWith('image/')) {
                fileData.extractedText = await extractTextFromImage(req.file.path);
                contextData.set('fileContext', fileData.extractedText);
            }
        }

        // Save user message
        const userMessage = new ChatMessage({
            userId: req.user._id,
            type: 'user',
            content,
            fileData,
            contextData
        });
        await userMessage.save();

        // Generate AI response using Groq
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI study assistant. Use the provided context to answer questions accurately.'
                },
                {
                    role: 'user',
                    content: `Context: ${fileData.extractedText || ''} \n\nQuestion: ${content}`
                }
            ],
            model: 'mixtral-8x7b-32768',
            temperature: 0.5,
            max_tokens: 1000
        });

        // Save AI response
        const aiMessage = new ChatMessage({
            userId: req.user._id,
            type: 'ai',
            content: completion.choices[0].message.content,
            contextData
        });
        await aiMessage.save();

        res.json({
            userMessage,
            aiMessage
        });
    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({ message: 'Failed to process chat message' });
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
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
};