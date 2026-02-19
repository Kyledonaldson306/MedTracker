import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration response:', data); // DEBUG LINE
      console.log('New badges:', data.newBadges); // This should show the badges array

      
      localStorage.setItem('medtracker_token', data.token);
      localStorage.setItem('medtracker_user', JSON.stringify(data.user));
      
      // Store new badges in localStorage to show on home page
      if (data.newBadges && data.newBadges.length > 0) {
        localStorage.setItem('pending_badges', JSON.stringify(data.newBadges));
      }
      
      onLogin();
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err); // DEBUG LINE
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>MedTracker</h1>
        <p>Create your account to get started</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Your username"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@email.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="At least 6 characters"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-redirect">
        Already have an account? <Link to="/login">Log in here</Link>
      </p>

    </div>
  );
}

export default Register;