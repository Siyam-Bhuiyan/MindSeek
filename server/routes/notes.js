const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Protected routes - require authentication
router.use(authenticateUser);

// Get all notes
router.get('/', noteController.getNotes);

// Get note by ID
router.get('/:id', noteController.getNoteById);

// Create new note
router.post('/', noteController.upload, noteController.createNote);

// Update note
router.patch('/:id', noteController.updateNote);

// Delete note
router.delete('/:id', noteController.deleteNote);

// Add annotation to note
router.post('/:id/annotations', noteController.addAnnotation);

// Approve note (teacher only)
router.patch('/:id/approve', authorizeRole(['teacher']), noteController.approveNote);

module.exports = router;