import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import AddMedication from './pages/AddMedication';
import EditMedication from './pages/EditMedication';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import Register from './pages/Register';
import Badges from './pages/Badges';

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
    return (
      <div className="app-shell">
        <div className="container">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-shell">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/" />
                : <Login onLogin={handleLogin} />
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated
                ? <Navigate to="/" />
                : <Register onLogin={handleLogin} />
            }
          />

          <Route
            path="/"
            element={
              isAuthenticated
                ? <Home onLogout={handleLogout} />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/add"
            element={
              isAuthenticated
                ? <AddMedication />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/edit/:id"
            element={
              isAuthenticated
                ? <EditMedication />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/schedule"
            element={
              isAuthenticated
                ? <Schedule />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/badges"
            element={
              isAuthenticated
                ? <Badges />
                : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
