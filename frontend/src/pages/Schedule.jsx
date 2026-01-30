import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedications } from '../services/api';

function Schedule() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const data = await getMedications();
      setMedications(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading schedule:', error);
      setLoading(false);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  if (loading) {
    return <div className="container">Loading schedule...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Today's Medication Schedule</h1>
        <p>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back to Home
      </Link>

      {medications.length === 0 ? (
        <div className="empty-state">
          <p>No medications scheduled for today.</p>
          <Link to="/add" className="btn btn-primary">Add a Medication</Link>
        </div>
      ) : (
        <div className="schedule-list">
          {medications.map((med) => {
            const times = typeof med.times === 'string' ? JSON.parse(med.times) : med.times;
            return (
              <div key={med.id} className="schedule-card">
                <h3>{med.name}</h3>
                <p><strong>Dosage:</strong> {med.dosage}</p>
                
                <div className="schedule-times">
                  <strong>Scheduled Times:</strong>
                  <ul>
                    {times.map((time, index) => {
                      const currentTime = getCurrentTime();
                      let statusClass = 'upcoming';
                      let statusText = 'Upcoming';
                      
                      if (time < currentTime) {
                        statusClass = 'past';
                        statusText = 'Past';
                      } else if (time === currentTime) {
                        statusClass = 'now';
                        statusText = 'Now';
                      }
                      
                      return (
                        <li key={index} className="time-item">
                          <span className="time">{time}</span>
                          <span className={`status ${statusClass}`}>{statusText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {med.notes && (
                  <p className="notes"><strong>Notes:</strong> {med.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Schedule;