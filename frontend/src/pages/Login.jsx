import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import MedicalNews from '../components/MedicalNews';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

        try {
      const data = await login(formData);
      localStorage.setItem('medtracker_token', data.token);
      localStorage.setItem('medtracker_user', JSON.stringify(data.user));
      
      // Store new badges in localStorage to show on home page
      if (data.newBadges && data.newBadges.length > 0) {
        localStorage.setItem('pending_badges', JSON.stringify(data.newBadges));
      }
      
      onLogin();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', width: '100%', maxWidth: '1400px' }}>      
      
      <div className="container" style={{ width: '700px', flexShrink: 0 }}>        <div className="header">
          <h1>MedTracker</h1>
          <p>Welcome back! Please log in.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
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
              placeholder="Your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>

      <MedicalNews />
    </div>
  );
}

export default Login;