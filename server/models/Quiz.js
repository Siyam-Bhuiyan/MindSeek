const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple_choice', 'short_answer'],
        required: true
    },
    options: [{
        type: String
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String
    }
});

const studentResponseSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        question: {
            type: Schema.Types.ObjectId,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    score: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    sourceNote: {
        type: Schema.Types.ObjectId,
        ref: 'Note',
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [questionSchema],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    studentResponses: [studentResponseSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

quizSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;