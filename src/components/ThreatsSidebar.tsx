import { ProximityAlert } from '../types';
import { formatDistance } from '../utils/geolocation';
import './ThreatsSidebar.css';

interface ThreatsSidebarProps {
  alerts: ProximityAlert[];
}

export function ThreatsSidebar({ alerts }: ThreatsSidebarProps) {
  const getAlertColor = (distance: number) => {
    if (distance < 100) return '#ff0000';
    if (distance < 500) return '#ffa500';
    return '#ffff00';
  };

  const formatThreatType = (type: string) => {
    return type.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="threats-sidebar">
      <div className="sidebar-header">
        <h2>⚠️ THREATS DETECTED</h2>
        <div className="threat-count">{alerts.length} Active</div>
      </div>
      
      <div className="threats-list">
        {alerts.map((alert) => (
          <div key={alert.location.id} className="threat-item">
            <div className="threat-header">
              <span className="threat-type" style={{ color: getAlertColor(alert.distance) }}>
                {formatThreatType(alert.location.type)}
              </span>
              <span className="threat-distance" style={{ color: getAlertColor(alert.distance) }}>
                {formatDistance(alert.distance)}
              </span>
            </div>
            
            <div className="threat-body">
              <div className="threat-description">
                {alert.location.description}
              </div>
              
              <div className="threat-arrow-container">
                <div 
                  className="threat-arrow"
                  style={{ transform: `rotate(${alert.bearing}deg)` }}
                  title={`Bearing: ${Math.round(alert.bearing)}°`}
                >
                  ↑
                </div>
                <div className="bearing-text">{Math.round(alert.bearing)}°</div>
              </div>
            </div>
            
            {alert.location.isPermanent && (
              <div className="permanent-badge">
                📍 Permanent Location
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
