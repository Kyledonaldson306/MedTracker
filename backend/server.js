const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MedTracker API is running!' });
});

// Get all medications
app.get('/api/medications', (req, res) => {
  const sql = 'SELECT * FROM medications ORDER BY created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ medications: rows });
  });
});

// Get a single medication by ID
app.get('/api/medications/:id', (req, res) => {
  const sql = 'SELECT * FROM medications WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
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
app.post('/api/medications', (req, res) => {
  const { name, dosage, frequency, times, notes } = req.body;
  
  // Validation
  if (!name || !dosage || !frequency || !times) {
    res.status(400).json({ error: 'Name, dosage, frequency, and times are required' });
    return;
  }
  
  const sql = `INSERT INTO medications (name, dosage, frequency, times, notes) 
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, dosage, frequency, JSON.stringify(times), notes || ''];
  
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
        notes
      }
    });
  });
});

// Update a medication
app.put('/api/medications/:id', (req, res) => {
  const { name, dosage, frequency, times, notes } = req.body;
  
  const sql = `UPDATE medications 
               SET name = ?, dosage = ?, frequency = ?, times = ?, notes = ?
               WHERE id = ?`;
  const params = [name, dosage, frequency, JSON.stringify(times), notes || '', req.params.id];
  
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
app.delete('/api/medications/:id', (req, res) => {
  const sql = 'DELETE FROM medications WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
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

// Get today's medication schedule
app.get('/api/schedule/today', (req, res) => {
  const sql = `SELECT m.*, m.times as medication_times 
               FROM medications m`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Parse times and create today's schedule
    const schedule = rows.map(med => ({
      ...med,
      times: JSON.parse(med.medication_times)
    }));
    
    res.json({ schedule });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});