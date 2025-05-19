import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: mode === 'register' ? '' : undefined,
  });

  const { login, register, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      navigate('/home');
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">
            Mind<span>Seek</span>
          </h1>
          <h2 className="auth-title">
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : 'Get started with your free account today'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="auth-links">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">Sign up</Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            )}
          </div>

          <div className="auth-separator">
            <span>or continue with</span>
          </div>

          <div className="social-auth">
            <button type="button" className="social-btn">
              <FaGoogle /> Google
            </button>
            <button type="button" className="social-btn">
              <FaGithub /> GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;