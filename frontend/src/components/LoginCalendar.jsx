import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getUserStreak } from '../services/api';

function LoginCalendar() {
  const [loginDates, setLoginDates] = useState([]);
  const [streakData, setStreakData] = useState(null);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = async () => {
    try {
      const data = await getUserStreak();
      setStreakData(data);
      
      // Generate login dates based on streak (simplified - you'd want to track actual dates in DB)
      const dates = [];
      const today = new Date();
      for (let i = 0; i < data.current_streak; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toDateString());
      }
      setLoginDates(dates);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const tileClassName = ({ date }) => {
    if (loginDates.includes(date.toDateString())) {
      return 'login-day';
    }
    return null;
  };

 return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      position: 'sticky',
      top: '20px',
      minHeight: '550px'
    }}>
      <h3 style={{ 
        color: '#667eea', 
        marginBottom: '10px', 
        textAlign: 'center', 
        fontSize: '1.5rem' 
      }}>
        🔥 Login Streak Calendar
      </h3>
      {streakData && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '8px 0', fontSize: '1rem' }}>
            <strong style={{ color: '#667eea' }}>Current Streak:</strong> {streakData.current_streak} days
          </p>
          <p style={{ margin: '8px 0', fontSize: '1rem' }}>
            <strong style={{ color: '#667eea' }}>Longest Streak:</strong> {streakData.longest_streak} days
          </p>
        </div>
      )}
      <Calendar
        tileClassName={tileClassName}
        maxDate={new Date()}
      />
    </div>
  );
}

export default LoginCalendar;