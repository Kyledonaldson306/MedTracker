import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBadges, getUserStreak } from '../services/api';
import BadgeDetailModal from '../components/BadgeDetailModal';


function Badges() {
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [badgesData, streakData] = await Promise.all([
        getUserBadges(),
        getUserStreak()
      ]);
      console.log('Badges data:', badgesData);
      console.log('Streak data:', streakData);
      setBadges(badgesData);
      setStreak(streakData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading badges:', error);
      setLoading(false);
    }
  };

  const extractEmoji = (name) => {
    if (!name || typeof name !== 'string') return '🏅';
    
    // Extract emoji using a simpler regex that catches most emojis
    const emojiRegex = /[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/u;
    const match = name.match(emojiRegex);
    
    return match ? match[0] : '🏅';
  };

  const extractName = (name) => {
    if (!name || typeof name !== 'string') {
      return 'Achievement';
    }
    return name.replace(/([\u{1F300}-\u{1F9FF}])/gu, '').trim();
  };

  const getBadgeType = (type) => {
    const types = {
      first_login: 'First Login Achievement',
      day_3: '3-Day Login Streak',
      day_7: '7-Day Login Streak',
      day_30: '30-Day Login Streak',
      day_100: '100-Day Login Streak',
      first_med: 'First Medication Added',
      med_5: '5 Medications Milestone',
      notifications: 'Notifications Enabled'
    };
    return types[type] || 'Achievement';
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Your Achievements 🏆</h1>
        <p>Keep up the great work!</p>
      </div>

      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back to Home
      </Link>

      {/* Streak Stats */}
      {streak && (
        <div className="streak-stats">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{streak.current_streak || 0}</h3>
              <p>Current Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{streak.longest_streak || 0}</h3>
              <p>Longest Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{streak.total_logins || 0}</h3>
              <p>Total Logins</p>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="badges-section">
        <h2>Badges Earned ({badges.length})</h2>
        
        {badges.length === 0 ? (
          <div className="empty-state">
            <p>No badges yet. Keep logging in daily to earn achievements!</p>
          </div>
        ) : (
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <div 
                key={badge.id} 
                className="badge-card badge-card-clickable"
                onClick={() => setSelectedBadge(badge)}
              >
                <div className="badge-icon">{extractEmoji(badge.name)}</div>
                <h3>{extractName(badge.name)}</h3>
                <p className="badge-type">Badge #{index + 1}</p>
                <p className="badge-date">
                  Earned: {new Date(badge.earned_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedBadge && (
        <BadgeDetailModal 
          badge={selectedBadge} 
          onClose={() => setSelectedBadge(null)} 
        />
      )}
    </div>
  );
}

export default Badges;