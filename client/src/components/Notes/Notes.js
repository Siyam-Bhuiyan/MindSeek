import React, { useState } from 'react';
import { FaBook, FaCalendarAlt, FaEllipsisH, FaFileUpload, FaRegClock, FaRegStar } from 'react-icons/fa';
import './Notes.css';

const Notes = () => {
  const [filter, setFilter] = useState('all');

  const dummyNotes = [
    {
      id: 1,
      subject: 'Mathematics',
      title: 'Calculus: Derivatives and Integrals',
      excerpt: 'Comprehensive notes covering the fundamentals of calculus, including derivatives, integrals, and their applications in real-world scenarios.',
      date: '2024-01-15',
      readTime: '15 mins',
      rating: 4.5,
    },
    {
      id: 2,
      subject: 'Physics',
      title: 'Quantum Mechanics Fundamentals',
      excerpt: 'Detailed exploration of quantum mechanics principles, wave-particle duality, and Schrödinger\'s equation with practical examples.',
      date: '2024-01-14',
      readTime: '20 mins',
      rating: 4.8,
    },
    {
      id: 3,
      subject: 'Computer Science',
      title: 'Data Structures and Algorithms',
      excerpt: 'Essential concepts of data structures and algorithms, including arrays, linked lists, trees, and common algorithmic approaches.',
      date: '2024-01-13',
      readTime: '25 mins',
      rating: 4.7,
    },
  ];

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1 className="notes-title">My Study Notes</h1>
        <div className="notes-actions">
          <div className="notes-filter">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="computer-science">Computer Science</option>
            </select>
          </div>
          <button className="upload-btn">
            <FaFileUpload /> Upload Notes
          </button>
        </div>
      </div>

      <div className="notes-grid">
        {dummyNotes.map((note) => (
          <div key={note.id} className="note-card">
            <div className="note-preview" />
            <div className="note-content">
              <span className="note-subject">{note.subject}</span>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-excerpt">{note.excerpt}</p>
              <div className="note-footer">
                <div className="note-meta">
                  <span className="meta-item">
                    <FaCalendarAlt />
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    <FaRegClock />
                    {note.readTime}
                  </span>
                  <span className="meta-item">
                    <FaRegStar />
                    {note.rating}
                  </span>
                </div>
                <div className="note-actions">
                  <button className="note-action-btn">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {dummyNotes.length === 0 && (
          <div className="empty-state">
            <FaBook className="empty-icon" />
            <h2 className="empty-title">No Notes Found</h2>
            <p className="empty-description">
              Start by uploading your study materials or creating new notes.
            </p>
            <button className="upload-btn">
              <FaFileUpload /> Upload Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;