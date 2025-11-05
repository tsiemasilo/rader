import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { RadarView } from './components/RadarView';
import { ControlPanel } from './components/ControlPanel';
import { useGeolocation } from './hooks/useGeolocation';
import { useProximityAlerts } from './hooks/useProximityAlerts';
import { getStoredLocations } from './utils/storage';
import { audioManager } from './utils/audio';
import { PoliceLocation } from './types';
import './App.css';

function App() {
  const [isRadarMode, setIsRadarMode] = useState(false);
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
        locationError={locationError}
        accuracyWarning={accuracyWarning}
      />
    </div>
  );
}

export default App;
