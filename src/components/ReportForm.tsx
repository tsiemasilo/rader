import React, { useState } from 'react';
import { UserLocation, PoliceLocation } from '../types';
import './ReportForm.css';

interface ReportFormProps {
  userLocation: UserLocation | null;
  onClose: () => void;
  onSubmit: (location: PoliceLocation) => void;
}

export function ReportForm({ userLocation, onClose, onSubmit }: ReportFormProps) {
  const [type, setType] = useState<PoliceLocation['type']>('police');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLocation) {
      alert('Location not available. Please enable GPS.');
      return;
    }

    const newLocation: PoliceLocation = {
      id: Date.now().toString(),
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      type,
      description: description || `${type.replace('_', ' ')} spotted`,
      timestamp: Date.now(),
      reportedBy: 'user',
    };

    onSubmit(newLocation);
    setDescription('');
    onClose();
  };

  return (
    <div className="report-overlay">
      <div className="report-form">
        <h2>Report Location</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type:</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as PoliceLocation['type'])}
            >
              <option value="police">Police</option>
              <option value="speed_camera">Speed Camera</option>
              <option value="mobile_camera">Mobile Camera</option>
              <option value="roadblock">Roadblock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description (optional):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this location..."
              rows={3}
            />
          </div>

          {userLocation && (
            <div className="location-info">
              <small>
                Reporting at: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
              </small>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
