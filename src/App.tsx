import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { RadarView } from './components/RadarView';
import { ControlPanel } from './components/ControlPanel';
import { ReportForm } from './components/ReportForm';
import { useGeolocation } from './hooks/useGeolocation';
import { useProximityAlerts } from './hooks/useProximityAlerts';
import { getStoredLocations, saveLocation } from './utils/storage';
import { audioManager } from './utils/audio';
import { PoliceLocation } from './types';
import './App.css';

function App() {
  const [isRadarMode, setIsRadarMode] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [policeLocations, setPoliceLocations] = useState<PoliceLocation[]>([]);
  
  const { location, error: locationError, accuracyWarning } = useGeolocation();
  const { alerts, closestAlert } = useProximityAlerts(location, policeLocations);

  useEffect(() => {
    setPoliceLocations(getStoredLocations());
  }, []);

  const handleToggleRadar = () => {
    audioManager.initializeAudio();
    setIsRadarMode(!isRadarMode);
  };

  const handleOpenReport = () => {
    audioManager.initializeAudio();
    setShowReportForm(true);
  };

  const handleReportSubmit = (newLocation: PoliceLocation) => {
    saveLocation(newLocation);
    setPoliceLocations(getStoredLocations());
  };

  return (
    <div className="app">
      <div className="view-container">
        {isRadarMode ? (
          <RadarView alerts={alerts} closestAlert={closestAlert} />
        ) : (
          <MapView userLocation={location} policeLocations={policeLocations} />
        )}
      </div>

      <ControlPanel
        alerts={alerts}
        closestAlert={closestAlert}
        isRadarMode={isRadarMode}
        onToggleRadar={handleToggleRadar}
        onOpenReport={handleOpenReport}
        locationError={locationError}
        accuracyWarning={accuracyWarning}
      />

      {showReportForm && (
        <ReportForm
          userLocation={location}
          onClose={() => setShowReportForm(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}

export default App;
