import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocation } from '../types';

const PREFERRED_ACCURACY = 100;
const MAX_ACCURACY = 250;
const TIMEOUT_MS = 20000;

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);
  
  const bestFixRef = useRef<UserLocation | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    setError(null);
    bestFixRef.current = null;

    timeoutRef.current = setTimeout(() => {
      if (bestFixRef.current && !location) {
        setLocation(bestFixRef.current);
        if (bestFixRef.current.accuracy > PREFERRED_ACCURACY) {
          setAccuracyWarning(`GPS accuracy is ${Math.round(bestFixRef.current.accuracy)}m. Location may be approximate.`);
        }
      } else if (!bestFixRef.current) {
        setError('Location request timed out. Please ensure location permissions are enabled and try again.');
        setIsTracking(false);
      }
    }, TIMEOUT_MS);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        
        const newLocation: UserLocation = {
          latitude,
          longitude,
          accuracy,
          heading: heading ?? undefined,
          speed: speed ?? undefined,
        };

        if (!bestFixRef.current || accuracy < bestFixRef.current.accuracy) {
          bestFixRef.current = newLocation;
        }

        if (accuracy <= PREFERRED_ACCURACY) {
          setLocation(newLocation);
          setError(null);
          setAccuracyWarning(null);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        } else if (accuracy <= MAX_ACCURACY) {
          setLocation(newLocation);
          setError(null);
          setAccuracyWarning(`GPS accuracy is ${Math.round(accuracy)}m. Location may be approximate.`);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      },
      (err) => {
        let errorMessage = 'Unable to get your location. ';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += err.message;
        }
        
        setError(errorMessage);
        setIsTracking(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    const cleanup = startTracking();
    return cleanup;
  }, [startTracking]);

  return { location, error, isTracking, accuracyWarning, startTracking, stopTracking };
}
