const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const badgeService = require('./badgeService');

const JWT_SECRET = 'medtracker_secret_key_change_in_production';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if email already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if username already exists
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.run(sql, [username, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const newUserId = this.lastID;

        // Generate token
        const token = jwt.sign(
          { userId: newUserId, username, email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Update login streak and award first login badge
        const badgeService = require('./badgeService');
        badgeService.updateLoginStreak(newUserId, (err, streakData) => {
          if (err) {
            console.error('Error updating streak:', err);
            // Still return success even if badge fails
            return res.json({
              message: 'Registration successful',
              token,
              user: { id: newUserId, username, email },
              streak: 1,
              newBadges: []
            });
          }

          res.json({
            message: 'Registration successful',
            token,
            user: { id: newUserId, username, email },
            streak: streakData?.streak || 1,
            newBadges: streakData?.newBadges || []
          });
        });
      });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update login streak and check for new badges
    const badgeService = require('./badgeService');
    badgeService.updateLoginStreak(user.id, (err, streakData) => {
      if (err) {
        console.error('Error updating streak:', err);
        // Still return success even if badge fails
        return res.json({
          message: 'Login successful',
          token,
          user: { id: user.id, username: user.username, email: user.email },
          streak: 0,
          newBadges: []
        });
      }

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, email: user.email },
        streak: streakData?.streak || 0,
        newBadges: streakData?.newBadges || []
      });
    });
  });
});

// Get current user info (protected)
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: decoded.userId, username: decoded.username, email: decoded.email } });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;