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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('mapTheme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });
  
  const { location, error: locationError, accuracyWarning } = useGeolocation();
  const { alerts, closestAlert } = useProximityAlerts(location, policeLocations);

  useEffect(() => {
    setPoliceLocations(getStoredLocations());
  }, []);

  useEffect(() => {
    localStorage.setItem('mapTheme', theme);
  }, [theme]);

  const handleToggleRadar = () => {
    audioManager.initializeAudio();
    setIsRadarMode(!isRadarMode);
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app">
      <div className="view-container">
        {isRadarMode ? (
          <RadarView alerts={alerts} closestAlert={closestAlert} userLocation={location} theme={theme} />
        ) : (
          <MapView userLocation={location} policeLocations={policeLocations} alerts={alerts} theme={theme} />
        )}
      </div>

      <ControlPanel
        closestAlert={closestAlert}
        isRadarMode={isRadarMode}
        onToggleRadar={handleToggleRadar}
        locationError={locationError}
        accuracyWarning={accuracyWarning}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}

export default App;
