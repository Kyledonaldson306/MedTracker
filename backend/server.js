const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3001;
const authRoutes = require('./authRoutes');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'medtracker_secret_key_change_in_production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auth routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MedTracker API is running!' });
});

/// Get all medications (only for the logged in user)
app.get('/api/medications', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC';
  
  db.all(sql, [req.userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ medications: rows });
  });
});

// Get a single medication by ID
app.get('/api/medications/:id', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM medications WHERE id = ? AND user_id = ?';
  
  db.get(sql, [req.params.id, req.userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Medication not found' });
      return;
    }
    res.json({ medication: row });
  });
});

// Create a new medication
app.post('/api/medications', verifyToken, (req, res) => {
  const { name, dosage, frequency, times, notes } = req.body;
  
  if (!name || !dosage || !frequency || !times) {
    res.status(400).json({ error: 'Name, dosage, frequency, and times are required' });
    return;
  }
  
  const sql = `INSERT INTO medications (name, dosage, frequency, times, notes, user_id) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [name, dosage, frequency, JSON.stringify(times), notes || '', req.userId];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Medication created successfully',
      medication: {
        id: this.lastID,
        name,
        dosage,
        frequency,
        times,
        notes,
        user_id: req.userId
      }
    });
  });
});

// Update a medication
app.put('/api/medications/:id', verifyToken, (req, res) => {
  const { name, dosage, frequency, times, notes } = req.body;
  
  const sql = `UPDATE medications 
               SET name = ?, dosage = ?, frequency = ?, times = ?, notes = ?
               WHERE id = ? AND user_id = ?`;
  const params = [name, dosage, frequency, JSON.stringify(times), notes || '', req.params.id, req.userId];
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Medication not found' });
      return;
    }
    res.json({ message: 'Medication updated successfully' });
  });
});

// Delete a medication
app.delete('/api/medications/:id', verifyToken, (req, res) => {
  const sql = 'DELETE FROM medications WHERE id = ? AND user_id = ?';
  
  db.run(sql, [req.params.id, req.userId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Medication not found' });
      return;
    }
    res.json({ message: 'Medication deleted successfully' });
  });
});

// Get today's schedule (only for logged in user)
app.get('/api/schedule/today', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM medications WHERE user_id = ?';
  
  db.all(sql, [req.userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const schedule = rows.map(med => ({
      ...med,
      times: JSON.parse(med.times)
    }));
    
    res.json({ schedule });
  });
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});