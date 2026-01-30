import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMedication, updateMedication } from '../services/api';

function EditMedication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: [''],
    notes: ''
  });

  useEffect(() => {
    loadMedication();
  }, [id]);

  const loadMedication = async () => {
    try {
      const data = await getMedication(id);
      const times = typeof data.times === 'string' ? JSON.parse(data.times) : data.times;
      setFormData({
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        times: times,
        notes: data.notes || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading medication:', error);
      alert('Error loading medication');
      navigate('/');
    }
  };

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
    
    const filteredTimes = formData.times.filter(time => time.trim() !== '');
    
    if (filteredTimes.length === 0) {
      alert('Please add at least one time');
      return;
    }

    try {
      await updateMedication(id, {
        ...formData,
        times: filteredTimes
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating medication:', error);
      alert('Error updating medication. Please try again.');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Edit Medication</h1>
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
          <button type="submit" className="btn btn-primary">Update Medication</button>
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

export default EditMedication;