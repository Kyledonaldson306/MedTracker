import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedications, deleteMedication } from '../services/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedications, deleteMedication } from '../services/api';
import NotificationSettings from '../components/NotificationSettings';
import { checkUpcomingMedications } from '../services/notificationService';

function Home() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const data = await getMedications();
      setMedications(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading medications:', error);
      setLoading(false);
    }
  };

  // Check for medication reminders every minute
  useEffect(() => {
    if (medications.length > 0) {
      // Check immediately
      checkUpcomingMedications(medications);
      
      // Then check every minute
      const interval = setInterval(() => {
        checkUpcomingMedications(medications);
      }, 60000); // 60000ms = 1 minute

      return () => clearInterval(interval);
    }
  }, [medications]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await deleteMedication(id);
        loadMedications(); // Reload the list
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>MedTracker</h1>
        <p>Your Personal Medication Management System</p>
      </div>
    <NotificationSettings />
      <div className="actions">
        <Link to="/add" className="btn btn-primary">+ Add New Medication</Link>
        <Link to="/schedule" className="btn btn-secondary">View Today's Schedule</Link>
      </div>

      <div className="medications-list">
        <h2>My Medications ({medications.length})</h2>
        
        {medications.length === 0 ? (
          <div className="empty-state">
            <p>No medications added yet.</p>
            <Link to="/add" className="btn btn-primary">Add Your First Medication</Link>
          </div>
        ) : (
          <div className="med-grid">
            {medications.map((med) => (
              <div key={med.id} className="med-card">
                <h3>{med.name}</h3>
                <p><strong>Dosage:</strong> {med.dosage}</p>
                <p><strong>Frequency:</strong> {med.frequency}</p>
                <p><strong>Times:</strong> {JSON.parse(med.times).join(', ')}</p>
                {med.notes && <p><strong>Notes:</strong> {med.notes}</p>}
                
                <div className="card-actions">
                  <Link to={`/edit/${med.id}`} className="btn btn-small">Edit</Link>
                  <button 
                    onClick={() => handleDelete(med.id)} 
                    className="btn btn-small btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;