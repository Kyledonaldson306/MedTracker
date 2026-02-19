import { useEffect } from 'react';
import ReactDOM from 'react-dom';

function BadgeDetailModal({ badge, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!badge) return null;

  const getBadgeDescription = (type) => {
    const descriptions = {
      first_login: 'You logged into MedTracker for the very first time! Your journey to better medication management begins here.',
      day_3: 'You\'ve maintained a 3-day login streak! Consistency is the key to building healthy habits.',
      day_7: 'A full week of dedication! You\'ve logged in for 7 consecutive days.',
      day_30: 'An entire month of consistency! 30 days of taking control of your health.',
      day_100: '100 days of dedication! You\'ve shown incredible commitment to your health journey.',
      first_med: 'You added your first medication to MedTracker! Taking the first step toward organized health management.',
      med_5: 'You\'re managing 5 medications! Staying organized and on top of your health.',
      notifications: 'You enabled browser notifications! Now you\'ll never miss a medication reminder.'
    };
    return descriptions[type] || 'You earned this achievement!';
  };

  const getBadgeTitle = (type) => {
    const titles = {
      first_login: 'Badge #1',
      first_med: 'Badge #2',
      notifications: 'Badge #3',
      day_3: 'Badge #4',
      day_7: 'Badge #5',
      med_5: 'Badge #6',
      day_30: 'Badge #7',
      day_100: 'Badge #8'
    };
    return titles[badge_type] || 'Badge';
  };

  const extractEmoji = (name) => {
    if (!name || typeof name !== 'string') return '🏅';
    const emojiRegex = /[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/u;
    const match = name.match(emojiRegex);
    return match ? match[0] : '🏅';
  };

  const extractName = (name) => {
    if (!name || typeof name !== 'string') return 'Achievement';
    return name.replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, '').trim();
  };

  const badge_type = badge.badge_type || badge.type;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '40px' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
              {extractEmoji(badge.badge_name || badge.name)}
            </div>
            <h3 style={{ fontSize: '2rem', marginBottom: '15px', fontWeight: 'bold' }}>
              {extractName(badge.badge_name || badge.name)}
            </h3>
            <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '10px' }}>
              {getBadgeTitle(badge_type)}
            </p>
            <p style={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: 1.6, marginBottom: '15px' }}>
              {getBadgeDescription(badge_type)}
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '20px' }}>
              Earned on {new Date(badge.earned_date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default BadgeDetailModal;