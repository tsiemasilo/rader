import { useState, useEffect } from 'react';
import './LocationPermission.css';

interface LocationPermissionProps {
  onRequestLocation: () => void;
  error: string | null;
}

export function LocationPermission({ onRequestLocation, error }: LocationPermissionProps) {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          
          result.addEventListener('change', () => {
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          });
        })
        .catch(() => {
          setPermissionState('prompt');
        });
    } else {
      setPermissionState('prompt');
    }
  }, []);

  const handleRequestPermission = () => {
    // CRITICAL for iOS Safari: Call geolocation API immediately and synchronously
    // in the same call stack as the button click. Any async operations or state
    // updates between the click and this call will cause iOS to block the request.
    if (!('geolocation' in navigator)) {
      return;
    }
    
    // Call the parent callback AFTER we've initiated the geolocation request
    // This ensures iOS Safari sees the geolocation call as directly triggered by user action
    onRequestLocation();
  };

  if (permissionState === 'checking') {
    return (
      <div className="location-permission-screen">
        <div className="permission-card">
          <div className="permission-spinner"></div>
          <h2>Checking permissions...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="location-permission-screen">
      <div className="permission-card">
        <div className="permission-icon">📍</div>
        <h1>Location Access Required</h1>
        <p className="permission-description">
          This radar detector app needs access to your device location to:
        </p>
        <ul className="permission-reasons">
          <li>🚗 Show your current position on the map</li>
          <li>📡 Calculate distance to nearby radar cameras</li>
          <li>🔔 Provide real-time proximity alerts</li>
          <li>🧭 Display accurate navigation directions</li>
        </ul>
        
        {permissionState === 'denied' ? (
          <div className="permission-denied">
            <p className="error-message">
              ❌ Location access was previously denied
            </p>
            <p className="recovery-instructions">
              To use this app, please enable location permissions in your browser settings:
            </p>
            <ol className="recovery-steps">
              <li>Tap the lock/info icon in your browser's address bar</li>
              <li>Find "Location" in the permissions list</li>
              <li>Change it to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        ) : (
          <>
            <button 
              className="permission-button" 
              onClick={handleRequestPermission}
            >
              Enable Location Access
            </button>
            <p className="permission-note">
              Your location data stays on your device and is never shared
            </p>
          </>
        )}

        {error && (
          <div className="permission-error">
            <p>{error}</p>
          </div>
        )}

        <div className="permission-privacy">
          <small>🔒 Your privacy is protected. Location data is only used for proximity calculations.</small>
        </div>
      </div>
    </div>
  );
}
