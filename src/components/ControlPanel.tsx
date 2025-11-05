import { ProximityAlert } from '../types';
import { formatDistance, getAlertLevel } from '../utils/geolocation';
import { BurgerMenu } from './BurgerMenu';
import './ControlPanel.css';

interface ControlPanelProps {
  closestAlert: ProximityAlert | null;
  isRadarMode: boolean;
  onToggleRadar: () => void;
  locationError: string | null;
  accuracyWarning: string | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function ControlPanel({
  closestAlert,
  isRadarMode,
  onToggleRadar,
  locationError,
  accuracyWarning,
  theme,
  onToggleTheme,
}: ControlPanelProps) {
  return (
    <>
      <BurgerMenu
        isRadarMode={isRadarMode}
        onToggleRadar={onToggleRadar}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      
      {!isRadarMode && (
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
        </div>
      )}
    </>
  );
}
