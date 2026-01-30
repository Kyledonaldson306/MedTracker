import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMedication } from '../services/api';

function AddMedication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: [''],
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, times: [...formData.times, ''] });
  };

  const removeTimeSlot = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty times
    const filteredTimes = formData.times.filter(time => time.trim() !== '');
    
    if (filteredTimes.length === 0) {
      alert('Please add at least one time');
      return;
    }

    try {
      await createMedication({
        ...formData,
        times: filteredTimes
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating medication:', error);
      alert('Error creating medication. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Add New Medication</h1>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Medication Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Aspirin"
          />
        </div>

        <div className="form-group">
          <label>Dosage *</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
            placeholder="e.g., 100mg"
          />
        </div>

        <div className="form-group">
          <label>Frequency *</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          >
            <option value="daily">Daily</option>
            <option value="twice-daily">Twice Daily</option>
            <option value="three-times-daily">Three Times Daily</option>
            <option value="weekly">Weekly</option>
            <option value="as-needed">As Needed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Times to Take *</label>
          {formData.times.map((time, index) => (
            <div key={index} className="time-input-group">
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                required
              />
              {formData.times.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  className="btn btn-small btn-danger"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTimeSlot}
            className="btn btn-small"
          >
            + Add Another Time
          </button>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special instructions..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Medication</button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMedication;