import React, { useState } from 'react';
import { FaClock, FaQuestionCircle, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import './Quiz.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const dummyQuiz = {
    title: 'Introduction to Calculus',
    subject: 'Mathematics',
    totalQuestions: 5,
    timeLimit: '30 minutes',
    questions: [
      {
        id: 1,
        text: 'What is the derivative of x²?',
        options: [
          { id: 'a', text: '2x' },
          { id: 'b', text: 'x²' },
          { id: 'c', text: 'x' },
          { id: 'd', text: '2' },
        ],
        correctAnswer: 'a',
      },
      {
        id: 2,
        text: 'What is the integral of 2x?',
        options: [
          { id: 'a', text: '2x' },
          { id: 'b', text: 'x²' },
          { id: 'c', text: 'x²+C' },
          { id: 'd', text: '2x²' },
        ],
        correctAnswer: 'c',
      },
      // Add more questions as needed
    ],
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(prev => 
      Math.min(dummyQuiz.questions.length - 1, prev + 1)
    );
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    dummyQuiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      score: Math.round((correct / dummyQuiz.questions.length) * 100),
      correct,
      incorrect: dummyQuiz.questions.length - correct,
    };
  };

  if (quizSubmitted) {
    const results = calculateScore();
    return (
      <div className="quiz-container">
        <div className="question-card result-card">
          <div className="result-score">{results.score}%</div>
          <h2 className="result-message">
            {results.score >= 70 ? 'Great job!' : 'Keep practicing!'}
          </h2>
          <div className="result-stats">
            <div className="stat-item">
              <div className="stat-value">{dummyQuiz.questions.length}</div>
              <div className="stat-label">Total Questions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{results.correct}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{results.incorrect}</div>
              <div className="stat-label">Incorrect Answers</div>
            </div>
          </div>
          <button className="quiz-btn next-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = dummyQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / dummyQuiz.questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">{dummyQuiz.title}</h1>
        <p className="quiz-subtitle">{dummyQuiz.subject}</p>
        <div className="quiz-meta">
          <span className="meta-item">
            <FaQuestionCircle />
            {dummyQuiz.totalQuestions} Questions
          </span>
          <span className="meta-item">
            <FaClock />
            {dummyQuiz.timeLimit}
          </span>
        </div>
        <div className="quiz-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="question-card">
        <div className="question-number">
          Question {currentQuestion + 1} of {dummyQuiz.questions.length}
        </div>
        <div className="question-text">{currentQuestionData.text}</div>
        <div className="options-grid">
          {currentQuestionData.options.map((option) => (
            <div
              key={option.id}
              className={`option-item ${selectedAnswers[currentQuestionData.id] === option.id ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(currentQuestionData.id, option.id)}
            >
              <div className="option-content">
                <div className="option-marker">{option.id.toUpperCase()}</div>
                <div className="option-text">{option.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            className="quiz-btn prev-btn"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            <FaChevronLeft /> Previous
          </button>
          {currentQuestion === dummyQuiz.questions.length - 1 ? (
            <button
              className="quiz-btn submit-btn"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length !== dummyQuiz.questions.length}
            >
              <FaCheck /> Submit
            </button>
          ) : (
            <button
              className="quiz-btn next-btn"
              onClick={handleNextQuestion}
            >
              Next <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;