import { useEffect } from 'react';
import ReactDOM from 'react-dom';

function BadgeModal({ badges, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!badges || badges.length === 0) return null;

  const getBadgeDescription = (type) => {
    const descriptions = {
      first_login: 'Your journey starts here! Track your medications and build healthy habits.',
      day_3: 'Three days of consistency! Keep logging in daily.',
      day_7: 'A full week of dedication! You\'re building a strong habit.',
      day_30: 'An entire month! You\'re unstoppable!',
      day_100: 'Incredible! 100 days of dedication!',
      first_med: 'You added your first medication! Taking control of your health.',
      med_5: 'Managing 5 medications! You\'re staying organized.',
      notifications: 'You\'ll never miss a dose now!'
    };
    return descriptions[type] || 'Achievement unlocked!';
  };

  const extractEmoji = (name) => {
  if (!name || typeof name !== 'string') return '🏅';
  
  // Extract emoji using a simpler regex that catches most emojis
  const emojiRegex = /[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/u;
  const match = name.match(emojiRegex);
  
  return match ? match[0] : '🏅';
};

  const extractName = (name) => {
    if (!name || typeof name !== 'string') return 'Achievement';
    return name.replace(/([\u{1F300}-\u{1F9FF}])/gu, '').trim();
  };

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
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '40px', fontSize: '2.2rem', fontWeight: 'bold' }}>
          🎉 New Badge Earned!
        </h2>
        
        <div style={{ marginBottom: '40px' }}>
          {badges.map((badge, index) => (
            <div 
              key={index}
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
                {extractEmoji(badge.name)}
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '15px', fontWeight: 'bold' }}>
                {extractName(badge.name)}
              </h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.95, lineHeight: 1.6 }}>
                {getBadgeDescription(badge.type)}
              </p>
            </div>
          ))}
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
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default BadgeModal;