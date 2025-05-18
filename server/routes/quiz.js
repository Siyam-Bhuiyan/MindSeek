const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Protected routes - require authentication
router.use(authenticateUser);

// Get all quizzes
router.get('/', quizController.getQuizzes);

// Get quiz by ID
router.get('/:id', quizController.getQuizById);

// Create new quiz
router.post('/', authorizeRole(['teacher']), quizController.createQuiz);

// Update quiz
router.patch('/:id', quizController.updateQuiz);

// Delete quiz
router.delete('/:id', quizController.deleteQuiz);

// Submit quiz answers
router.post('/:id/submit', quizController.submitQuiz);

module.exports = router;