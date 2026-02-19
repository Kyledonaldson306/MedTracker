const db = require('./database');

// Badge definitions
// Badge definitions
const BADGES = {
  FIRST_LOGIN: { type: 'first_login', name: 'Welcome Aboard! 🏅', description: 'Logged in for the first time' },
  DAY_3: { type: 'day_3', name: '3-Day Streak 🏅', description: 'Logged in for 3 consecutive days' },
  DAY_7: { type: 'day_7', name: 'Week Warrior 🎖️', description: 'Logged in for 7 consecutive days' },
  DAY_30: { type: 'day_30', name: 'Monthly Master 🏆', description: 'Logged in for 30 consecutive days' },
  DAY_100: { type: 'day_100', name: 'Century Club 👑', description: 'Logged in for 100 consecutive days' },
  FIRST_MED: { type: 'first_med', name: 'Getting Started 🏅', description: 'Added your first medication' },
  MED_5: { type: 'med_5', name: 'Organized 🎖️', description: 'Added 5 medications' },
  NOTIFICATIONS: { type: 'notifications', name: 'Stay Notified 🏅', description: 'Enabled notifications' }
};

// Award a badge to a user
const awardBadge = (userId, badgeType, callback) => {
  const badge = BADGES[badgeType];
  if (!badge) {
    return callback(new Error('Invalid badge type'));
  }
  
    console.log('Awarding badge:', badge); // ADD THIS LINE

  // Check if user already has this badge
  db.get('SELECT * FROM badges WHERE user_id = ? AND badge_type = ?', [userId, badge.type], (err, existing) => {
    if (err) return callback(err);
    if (existing) return callback(null, null); // Already has badge

    // Award the badge
    const sql = 'INSERT INTO badges (user_id, badge_type, badge_name) VALUES (?, ?, ?)';
    db.run(sql, [userId, badge.type, badge.name], function(err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, ...badge, earned_date: new Date() });
    });
  });
};

// Get all badges for a user
const getUserBadges = (userId, callback) => {
  db.all('SELECT * FROM badges WHERE user_id = ? ORDER BY earned_date DESC', [userId], callback);
};

// Update login streak and award badges
const updateLoginStreak = (userId, callback) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  db.get('SELECT * FROM login_streaks WHERE user_id = ?', [userId], (err, streak) => {
    if (err) return callback(err);

    const newBadges = [];

    if (!streak) {
      // First time login - create streak record
      const sql = `INSERT INTO login_streaks (user_id, current_streak, longest_streak, last_login_date, total_logins) 
                   VALUES (?, 1, 1, ?, 1)`;
      db.run(sql, [userId, today], function(err) {
        if (err) return callback(err);

        // Award first login badge
        awardBadge(userId, 'FIRST_LOGIN', (err, badge) => {
          if (err) return callback(err);
          if (badge) newBadges.push(badge);
          callback(null, { streak: 1, newBadges });
        });
      });
    } else {
      // Parse dates
      const lastLoginDate = new Date(streak.last_login_date + 'T00:00:00');
      const todayDate = new Date(today + 'T00:00:00');
      
      // Calculate difference in days
      const daysDiff = Math.floor((todayDate - lastLoginDate) / (1000 * 60 * 60 * 24));

      console.log('Last login:', streak.last_login_date);
      console.log('Today:', today);
      console.log('Days difference:', daysDiff);

      let newStreak = streak.current_streak;
      let longestStreak = streak.longest_streak;

      if (daysDiff === 0) {
        // Already logged in today - don't change anything
        return callback(null, { streak: newStreak, newBadges: [] });
      } else if (daysDiff === 1) {
        // Consecutive day - increment streak
        newStreak += 1;
        console.log('Consecutive login! New streak:', newStreak);
      } else {
        // Streak broken - reset to 1
        newStreak = 1;
        console.log('Streak broken. Resetting to 1');
      }

      // Update longest streak if necessary
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }

      // Update streak in database
      const sql = `UPDATE login_streaks 
                   SET current_streak = ?, longest_streak = ?, last_login_date = ?, total_logins = total_logins + 1
                   WHERE user_id = ?`;
      
      db.run(sql, [newStreak, longestStreak, today, userId], function(err) {
        if (err) return callback(err);

        // Check for streak badges
        const checkBadges = async () => {
          const badgeChecks = [
            { streak: 3, type: 'DAY_3' },
            { streak: 7, type: 'DAY_7' },
            { streak: 30, type: 'DAY_30' },
            { streak: 100, type: 'DAY_100' }
          ];

          for (const check of badgeChecks) {
            if (newStreak === check.streak) {
              await new Promise((resolve) => {
                awardBadge(userId, check.type, (err, badge) => {
                  if (badge) {
                    console.log('Awarded badge:', badge);
                    newBadges.push(badge);
                  }
                  resolve();
                });
              });
            }
          }

          console.log('Final streak:', newStreak, 'New badges:', newBadges);
          callback(null, { streak: newStreak, newBadges });
        };

        checkBadges();
      });
    }
  });
};

// Get user's current streak
const getUserStreak = (userId, callback) => {
  db.get('SELECT * FROM login_streaks WHERE user_id = ?', [userId], callback);
};

// Check and award medication-related badges
const checkMedicationBadges = (userId, medicationCount, callback) => {
  const newBadges = [];
  
  const checkBadge = (count, badgeType) => {
    return new Promise((resolve) => {
      if (medicationCount === count) {
        awardBadge(userId, badgeType, (err, badge) => {
          if (badge) newBadges.push(badge);
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  Promise.all([
    checkBadge(1, 'FIRST_MED'),
    checkBadge(5, 'MED_5')
  ]).then(() => {
    callback(null, newBadges);
  });
};

module.exports = {
  BADGES,
  awardBadge,
  getUserBadges,
  updateLoginStreak,
  getUserStreak,
  checkMedicationBadges
};