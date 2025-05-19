const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Groq } = require('groq-sdk');

const groq = new Groq();
const upload = multer({ storage: multer.memoryStorage() });

// Handle chat message processing
router.post('/process', upload.single('file'), async (req, res) => {
    try {
        const userMessage = req.body.content;
        
        // Generate AI response using Groq
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: userMessage }],
            model: 'mixtral-8x7b-32768',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const aiResponse = completion.choices[0].message.content;

        res.json({
            userMessage: { type: 'user', content: userMessage },
            aiMessage: { type: 'ai', content: aiResponse }
        });
    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({ message: 'Failed to process message' });
    }
});

// Handle speech to text conversion
router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
    try {
        // Placeholder for speech-to-text implementation
        res.json({ text: 'Speech to text conversion will be implemented here' });
    } catch (error) {
        console.error('Speech to text error:', error);
        res.status(500).json({ message: 'Speech to text conversion failed' });
    }
});

module.exports = router;