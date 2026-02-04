import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import AddMedication from './pages/AddMedication';
import EditMedication from './pages/EditMedication';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medtracker_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('medtracker_token');
    localStorage.removeItem('medtracker_user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register onRegister={handleLogin} /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/add" element={isAuthenticated ? <AddMedication /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={isAuthenticated ? <EditMedication /> : <Navigate to="/login" />} />
          <Route path="/schedule" element={isAuthenticated ? <Schedule /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;