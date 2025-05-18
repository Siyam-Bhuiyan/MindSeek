const Quiz = require('../models/Quiz');
const Note = require('../models/Note');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Generate quiz questions using OpenAI
async function generateQuestions(noteContent, difficulty, numQuestions = 5) {
    try {
        const prompt = `Generate ${numQuestions} ${difficulty} level multiple-choice questions based on this content:\n${noteContent}\n\nFormat each question as a JSON object with: question, options (array), correctAnswer, and explanation.`;

        const response = await groq.chat.completions.create({
            model: "mixtral-8x7b-32768",
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.7
        });

        const questions = JSON.parse(response.choices[0].message.content);
        return questions.map(q => ({
            ...q,
            type: 'multiple_choice'
        }));
    } catch (error) {
        console.error('Error generating questions:', error);
        throw error;
    }
}

// Create a new quiz
exports.createQuiz = async (req, res) => {
    try {
        const { noteId, title, description, difficulty } = req.body;

        // Get the source note
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Source note not found' });
        }

        // Generate questions using AI
        const questions = await generateQuestions(
            note.content + '\n' + (note.extractedText || ''),
            difficulty
        );

        const quiz = new Quiz({
            title,
            description,
            sourceNote: noteId,
            creator: req.user._id,
            questions,
            difficulty
        });

        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create quiz' });
    }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('sourceNote', 'title')
            .populate('creator', 'displayName');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('sourceNote', 'title')
            .populate('creator', 'displayName')
            .populate('studentResponses.student', 'displayName');
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch quiz' });
    }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const { answers } = req.body;
        let score = 0;
        const gradedAnswers = answers.map(answer => {
            const question = quiz.questions.id(answer.question);
            const isCorrect = question.correctAnswer === answer.answer;
            if (isCorrect) score++;
            return { ...answer, isCorrect };
        });

        const response = {
            student: req.user._id,
            answers: gradedAnswers,
            score: (score / quiz.questions.length) * 100
        };

        quiz.studentResponses.push(response);
        await quiz.save();

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit quiz' });
    }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Only creator or teacher can update
        if (quiz.creator.toString() !== req.user._id.toString() && 
            req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            quiz[key] = updates[key];
        });

        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update quiz' });
    }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Only creator or teacher can delete
        if (quiz.creator.toString() !== req.user._id.toString() && 
            req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await quiz.remove();
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete quiz' });
    }
};