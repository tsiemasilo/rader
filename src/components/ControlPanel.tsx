import { ProximityAlert } from '../types';
import { formatDistance, getAlertLevel } from '../utils/geolocation';
import './ControlPanel.css';

interface ControlPanelProps {
  alerts: ProximityAlert[];
  closestAlert: ProximityAlert | null;
  isRadarMode: boolean;
  onToggleRadar: () => void;
  locationError: string | null;
  accuracyWarning: string | null;
  onRequestLocation: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function ControlPanel({
  alerts,
  closestAlert,
  isRadarMode,
  onToggleRadar,
  locationError,
  accuracyWarning,
  onRequestLocation,
  theme,
  onToggleTheme,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="status-bar">
        {locationError ? (
          <div className="error-message">{locationError}</div>
        ) : closestAlert ? (
          <div className={`alert-badge ${getAlertLevel(closestAlert.distance)}`}>
            {closestAlert.location.type.replace('_', ' ').toUpperCase()} - {formatDistance(closestAlert.distance)}
          </div>
        ) : (
          <div className="status-ok">All Clear - Live Scanning</div>
        )}
        {accuracyWarning && !locationError && (
          <div className="accuracy-warning">⚠️ {accuracyWarning}</div>
        )}
      </div>

      <div className="controls">
        <button 
          className={`radar-toggle ${isRadarMode ? 'active' : ''}`}
          onClick={onToggleRadar}
        >
          {isRadarMode ? '🗺️ MAP VIEW' : '📡 RADAR VIEW'}
        </button>
        {!isRadarMode && (
          <button 
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK'}
          </button>
        )}
        {locationError && (
          <button 
            className="location-request-btn"
            onClick={onRequestLocation}
          >
            📍 REQUEST LOCATION
          </button>
        )}
      </div>

      {alerts.length > 0 && !isRadarMode && (
        <div className="alerts-list">
          <h3>Nearby Threats ({alerts.length})</h3>
          {alerts.slice(0, 5).map((alert) => (
            <div key={alert.location.id} className="alert-item">
              <span className="alert-type">{alert.location.type.replace('_', ' ')}</span>
              <span className="alert-distance">{formatDistance(alert.distance)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
