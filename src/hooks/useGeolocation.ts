import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocation } from '../types';

const PREFERRED_ACCURACY = 100;
const MAX_ACCURACY = 250;
const TIMEOUT_MS = 15000;

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
        setError(err.message);
        setIsTracking(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
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
