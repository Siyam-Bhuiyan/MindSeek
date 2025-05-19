import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { 
  FaSearch, 
  FaPlus, 
  FaBell, 
  FaUserCircle, 
  FaRegStickyNote, 
  FaQuestionCircle, 
  FaRobot, 
  FaChartLine,
  FaBook,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaEllipsisV,
  FaSun,
  FaMoon,
  FaImage
} from 'react-icons/fa';
import TextToImage from '../TextToImage/TextToImage';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [profileMenuActive, setProfileMenuActive] = useState(false);
  const [recentNotes, setRecentNotes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Mock data for demo purposes
  useEffect(() => {
    // Fetch data from API in real implementation
    setRecentNotes([
      { id: 1, title: 'Advanced Database Systems', subject: 'Computer Science', date: '2025-05-15', progress: 85 },
      { id: 2, title: 'Machine Learning Fundamentals', subject: 'Data Science', date: '2025-05-14', progress: 60 },
      { id: 3, title: 'Web Development with MERN', subject: 'Web Development', date: '2025-05-12', progress: 92 },
      { id: 4, title: 'Algorithms and Data Structures', subject: 'Computer Science', date: '2025-05-10', progress: 40 },
    ]);

    setUpcomingQuizzes([
      { id: 1, title: 'Database Normalization', subject: 'Advanced Database Systems', date: '2025-05-21', questions: 15 },
      { id: 2, title: 'Neural Networks', subject: 'Machine Learning', date: '2025-05-23', questions: 20 },
      { id: 3, title: 'React Components', subject: 'Web Development', date: '2025-05-25', questions: 12 },
    ]);

    setActivities([
      { id: 1, type: 'note_upload', title: 'Machine Learning Fundamentals', time: '2 hours ago' },
      { id: 2, type: 'quiz_completed', title: 'JavaScript Basics', score: '80%', time: '1 day ago' },
      { id: 3, type: 'note_verified', title: 'Advanced Database Systems', verifiedBy: 'Prof. Johnson', time: '3 days ago' },
      { id: 4, type: 'chat_session', title: 'React Hooks Discussion', duration: '45 minutes', time: '4 days ago' },
    ]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const toggleNotifications = () => {
    setNotificationsActive(!notificationsActive);
    if (profileMenuActive) setProfileMenuActive(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuActive(!profileMenuActive);
    if (notificationsActive) setNotificationsActive(false);
  };

  // Get user's progress statistics
  const getProgressStats = () => {
    return {
      notesUploaded: 24,
      quizzesTaken: 18,
      quizAvgScore: 85,
      studyHours: 42
    };
  };

  const stats = getProgressStats();

  // Calculate completion percentage for progress bars
  const calculateProgress = (current, total) => {
    return (current / total) * 100;
  };

  return (
    <div className="home-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${showMobileMenu ? 'show-mobile-menu' : ''}`}>
        <div className="logo">
          <h2>StudyConnect<span className="accent">AI</span></h2>
          <button className="close-menu-btn" onClick={() => setShowMobileMenu(false)}>×</button>
        </div>
        <nav className="side-nav">
          <ul>
            <li className={currentTab === 'dashboard' ? 'active' : ''}>
              <Link to="/home" onClick={() => setCurrentTab('dashboard')}>
                <FaChartLine className="nav-icon" /> Dashboard
              </Link>
            </li>
            <li className={currentTab === 'notes' ? 'active' : ''}>
              <Link to="/notes" onClick={() => setCurrentTab('notes')}>
                <FaRegStickyNote className="nav-icon" /> My Notes
              </Link>
            </li>
            <li className={currentTab === 'quizzes' ? 'active' : ''}>
              <Link to="/quizzes" onClick={() => setCurrentTab('quizzes')}>
                <FaQuestionCircle className="nav-icon" /> Quizzes
              </Link>
            </li>
            <li className={currentTab === 'ai-chat' ? 'active' : ''}>
              <Link to="/ai-chat" onClick={() => setCurrentTab('ai-chat')}>
                <FaRobot className="nav-icon" /> AI Chat
              </Link>
            </li>
            <li className={currentTab === 'library' ? 'active' : ''}>
              <Link to="/library" onClick={() => setCurrentTab('library')}>
                <FaBook className="nav-icon" /> Library
              </Link>
            </li>
            <li className={currentTab === 'calendar' ? 'active' : ''}>
              <Link to="/calendar" onClick={() => setCurrentTab('calendar')}>
                <FaCalendarAlt className="nav-icon" /> Calendar
              </Link>
            </li>
            <li className={currentTab === 'text-to-image' ? 'active' : ''}>
              <Link to="#" onClick={() => setCurrentTab('text-to-image')}>
                <FaImage className="nav-icon" /> Text to Image
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Link to="/settings" className="settings-link">
            <FaCog /> Settings
          </Link>
          <Link to="/logout" className="logout-link">
            <FaSignOutAlt /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {currentTab === 'text-to-image' && <TextToImage />}
        {/* Top Header */}
        <header className="header">
          <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search notes, quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>
          
          <div className="header-actions">
            <button 
              className="theme-toggle-btn" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
            </button>
            
            <Link to="/upload" className="upload-btn">
              <FaPlus /> Upload Note
            </Link>
            
            <div className="notification-wrapper">
              <button className="notification-btn" onClick={toggleNotifications}>
                <FaBell />
                <span className="notification-indicator"></span>
              </button>
              
              {notificationsActive && (
                <div className="notifications-dropdown">
                  <h3>Notifications</h3>
                  <ul className="notification-list">
                    <li className="notification-item unread">
                      <div className="notification-icon note">
                        <FaRegStickyNote />
                      </div>
                      <div className="notification-content">
                        <p>Your "Advanced Database Systems" note was verified</p>
                        <span className="notification-time">Just now</span>
                      </div>
                    </li>
                    <li className="notification-item unread">
                      <div className="notification-icon quiz">
                        <FaQuestionCircle />
                      </div>
                      <div className="notification-content">
                        <p>New quiz available: "Machine Learning Basics"</p>
                        <span className="notification-time">2 hours ago</span>
                      </div>
                    </li>
                    <li className="notification-item">
                      <div className="notification-icon chat">
                        <FaRobot />
                      </div>
                      <div className="notification-content">
                        <p>AI generated summary for "Web Development" ready</p>
                        <span className="notification-time">Yesterday</span>
                      </div>
                    </li>
                  </ul>
                  <a href="#all-notifications" className="view-all">View All Notifications</a>
                </div>
              )}
            </div>
            
            <div className="profile-wrapper">
              <button className="profile-btn" onClick={toggleProfileMenu}>
                <FaUserCircle />
              </button>
              
              {profileMenuActive && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <FaUserCircle className="profile-avatar" />
                    <div className="profile-info">
                      <h4>Alex Johnson</h4>
                      <p>Computer Science Student</p>
                    </div>
                  </div>
                  <ul className="profile-menu">
                    <li><Link to="/profile"><FaUserCircle /> My Profile</Link></li>
                    <li><Link to="/settings"><FaCog /> Settings</Link></li>
                    <li><Link to="/help"><FaQuestionCircle /> Help & Support</Link></li>
                    <li className="divider"></li>
                    <li><Link to="/logout" className="logout-option"><FaSignOutAlt /> Logout</Link></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-message">
              <h1>Welcome back, Alex! 👋</h1>
              <p>Continue your learning journey. You have 2 upcoming quizzes this week.</p>
            </div>
            <div className="date-display">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{stats.notesUploaded}</div>
              <div className="stat-label">Notes Uploaded</div>
              <div className="stat-icon notes-icon"><FaRegStickyNote /></div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.quizzesTaken}</div>
              <div className="stat-label">Quizzes Taken</div>
              <div className="stat-icon quizzes-icon"><FaQuestionCircle /></div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.quizAvgScore}%</div>
              <div className="stat-label">Quiz Avg. Score</div>
              <div className="stat-icon score-icon"><FaChartLine /></div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.studyHours}h</div>
              <div className="stat-label">Study Hours</div>
              <div className="stat-icon hours-icon"><FaBook /></div>
            </div>
          </div>
          
          {/* Recent Notes and Upcoming Quizzes */}
          <div className="dashboard-grid">
            <div className="dashboard-card recent-notes">
              <div className="card-header">
                <h2>Recent Notes</h2>
                <Link to="/notes" className="view-all-link">View All</Link>
              </div>
              <div className="notes-list">
                {recentNotes.map(note => (
                  <div className="note-item" key={note.id}>
                    <div className="note-info">
                      <h3 className="note-title">{note.title}</h3>
                      <span className="note-subject">{note.subject}</span>
                      <span className="note-date">Added: {new Date(note.date).toLocaleDateString()}</span>
                    </div>
                    <div className="note-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${note.progress}%` }}></div>
                      </div>
                      <span className="progress-text">{note.progress}% Complete</span>
                    </div>
                    <div className="note-actions">
                      <button className="action-btn view-btn">View</button>
                      <button className="action-btn more-btn"><FaEllipsisV /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dashboard-card upcoming-quizzes">
              <div className="card-header">
                <h2>Upcoming Quizzes</h2>
                <Link to="/quizzes" className="view-all-link">View All</Link>
              </div>
              <div className="quizzes-list">
                {upcomingQuizzes.map(quiz => (
                  <div className="quiz-item" key={quiz.id}>
                    <div className="quiz-date-badge">
                      <div className="date-month">{new Date(quiz.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                      <div className="date-day">{new Date(quiz.date).getDate()}</div>
                    </div>
                    <div className="quiz-info">
                      <h3 className="quiz-title">{quiz.title}</h3>
                      <span className="quiz-subject">{quiz.subject}</span>
                      <span className="quiz-questions">{quiz.questions} Questions</span>
                    </div>
                    <div className="quiz-actions">
                      <button className="quiz-btn take-quiz-btn">Take Quiz</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Activity Feed and AI Chat Starter */}
          <div className="dashboard-grid secondary-grid">
            <div className="dashboard-card activity-feed">
              <div className="card-header">
                <h2>Recent Activity</h2>
              </div>
              <div className="activities-list">
                {activities.map(activity => (
                  <div className="activity-item" key={activity.id}>
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'note_upload' && <FaRegStickyNote />}
                      {activity.type === 'quiz_completed' && <FaQuestionCircle />}
                      {activity.type === 'note_verified' && <FaBook />}
                      {activity.type === 'chat_session' && <FaRobot />}
                    </div>
                    <div className="activity-content">
                      {activity.type === 'note_upload' && (
                        <p>You uploaded <strong>{activity.title}</strong></p>
                      )}
                      {activity.type === 'quiz_completed' && (
                        <p>You completed <strong>{activity.title}</strong> quiz with a score of {activity.score}</p>
                      )}
                      {activity.type === 'note_verified' && (
                        <p>Your <strong>{activity.title}</strong> notes were verified by {activity.verifiedBy}</p>
                      )}
                      {activity.type === 'chat_session' && (
                        <p>You had a <strong>{activity.title}</strong> chat session ({activity.duration})</p>
                      )}
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dashboard-card ai-chat-starter">
              <div className="card-header">
                <h2>AI Study Assistant</h2>
              </div>
              <div className="ai-chat-content">
                <div className="ai-chat-icon">
                  <FaRobot />
                </div>
                <h3>Have questions about your notes?</h3>
                <p>Ask your AI study assistant to help you understand concepts, create study guides, or prepare for exams.</p>
                <div className="quick-prompts">
                  <button className="prompt-btn">Explain ACID properties in databases</button>
                  <button className="prompt-btn">Generate a quiz on React hooks</button>
                  <button className="prompt-btn">Summarize my ML notes</button>
                </div>
                <Link to="/ai-chat" className="start-chat-btn">Start Chatting</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;