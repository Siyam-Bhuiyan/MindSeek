import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

import { FaBook, FaRobot, FaQuestionCircle, FaClipboardCheck, FaUsers } from 'react-icons/fa';
import { IoMdDocument } from 'react-icons/io';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Change navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      text: "This platform completely transformed how I organize my study materials. The AI-generated quizzes help me prepare for exams more effectively.",
      name: "Sarah K.",
      role: "Computer Science Student"
    },
    {
      id: 2,
      text: "As an educator, I can easily verify and provide feedback on student notes. The analytics dashboard gives me insights into areas where my students need more support.",
      name: "Prof. James Wilson",
      role: "Engineering Faculty"
    },
    {
      id: 3,
      text: "The ability to chat with my notes is revolutionary! I can ask questions about my lecture content and get immediate answers without sifting through pages of material.",
      name: "Miguel L.",
      role: "Medical Student"
    }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="logo">
            <h1>StudyConnect<span className="highlight">AI</span></h1>
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <Link to="/login" className="nav-btn login-btn">Login</Link>
            <Link to="/register" className="nav-btn register-btn">Register</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Study Experience with AI</h1>
          <p>Upload notes, generate quizzes, chat with your study materials, and collaborate with peers - all in one platform.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn primary-btn">Get Started</Link>
            <a href="#how-it-works" className="btn secondary-btn">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="../../../public/images/land.svg" alt="Students collaborating on digital platform" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Intelligent Features For Modern Learning</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><IoMdDocument /></div>
            <h3>Smart Note Processing</h3>
            <p>Upload PDFs or images of your notes and our AI will extract text, organize content, and make it searchable.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaQuestionCircle /></div>
            <h3>AI Quiz Generation</h3>
            <p>Automatically create quizzes based on your notes to test your knowledge and prepare for exams.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaRobot /></div>
            <h3>Chat with Your Notes</h3>
            <p>Ask questions about your study materials and get instant, context-aware answers from our AI.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUsers /></div>
            <h3>Collaborative Learning</h3>
            <p>Share notes, quizzes, and insights with classmates to enhance the learning experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaClipboardCheck /></div>
            <h3>Teacher Verification</h3>
            <p>Teachers can review, approve, and annotate student notes to ensure accuracy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaBook /></div>
            <h3>Comprehensive Dashboard</h3>
            <p>Track your progress, manage your materials, and gain insights about your learning patterns.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <h2>How StudyConnectAI Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Your Notes</h3>
            <p>Take photos of handwritten notes or upload PDFs of lecture materials.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Processing</h3>
            <p>Our system extracts text, organizes content, and prepares it for interaction.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Interact & Learn</h3>
            <p>Generate quizzes, chat with your notes, and collaborate with peers.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Track Progress</h3>
            <p>Monitor your understanding through performance analytics and teacher feedback.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Study Experience?</h2>
          <p>Join thousands of students and educators already using StudyConnectAI to enhance their learning journey.</p>
          <Link to="/register" className="btn primary-btn">Get Started Today</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>StudyConnectAI</h2>
            <p>Revolutionizing collaborative learning with AI</p>
          </div>
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Platform</h3>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <Link to="/pricing">Pricing</Link>
            </div>
            <div className="footer-links-column">
              <h3>Resources</h3>
              <Link to="/blog">Blog</Link>
              <Link to="/tutorials">Tutorials</Link>
              <Link to="/faq">FAQ</Link>
            </div>
            <div className="footer-links-column">
              <h3>Company</h3>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StudyConnectAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;