const Note = require('../models/Note');
const multer = require('multer');
const path = require('path');
const { extractTextFromImage } = require('../utils/ocrUtils');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

exports.upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb('Error: Only PDF and Images allowed!');
    }
}).single('file');



// Create a new note
exports.createNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        let extractedText = '';

        // If file was uploaded, process it
        if (req.file) {
            // For images, use Tesseract.js
            if (req.file.mimetype.startsWith('image/')) {
                extractedText = await extractTextFromImage(req.file.path);
            }
            // For PDFs, implement PDF text extraction here
        }

        const note = new Note({
            title,
            content,
            tags: tags ? tags.split(',') : [],
            creator: req.user._id,
            fileUrl: req.file ? req.file.path : null,
            extractedText
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create note' });
    }
};

// Get all notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find()
            .populate('creator', 'displayName')
            .populate('annotations.user', 'displayName');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notes' });
    }
};

// Get note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('creator', 'displayName')
            .populate('annotations.user', 'displayName');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch note' });
    }
};

// Update note
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if user is creator or teacher
        if (note.creator.toString() !== req.user._id.toString() && 
            req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            note[key] = updates[key];
        });

        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note' });
    }
};

// Delete note
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if user is creator or teacher
        if (note.creator.toString() !== req.user._id.toString() && 
            req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await note.remove();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete note' });
    }
};

// Add annotation
exports.addAnnotation = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.annotations.push({
            user: req.user._id,
            text: req.body.text
        });

        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add annotation' });
    }
};

// Approve note (teacher only)
exports.approveNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.approved = true;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve note' });
    }
};