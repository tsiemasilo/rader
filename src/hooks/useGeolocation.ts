import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocation } from '../types';

const PREFERRED_ACCURACY = 50;
const MAX_ACCURACY = 150;
const POSITION_TIMEOUT = 20000;
const FALLBACK_TIMEOUT_MS = 25000;

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);
  
  const bestFixRef = useRef<UserLocation | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    stopTracking();

    setIsTracking(true);
    setError(null);
    bestFixRef.current = null;

    timeoutRef.current = setTimeout(() => {
      if (bestFixRef.current) {
        setLocation(bestFixRef.current);
        setError(null);
        if (bestFixRef.current.accuracy > PREFERRED_ACCURACY) {
          setAccuracyWarning(`GPS accuracy is ${Math.round(bestFixRef.current.accuracy)}m. Location may be approximate.`);
        } else {
          setAccuracyWarning(null);
        }
      } else {
        setError('Unable to get your location. Please enable location permissions in your browser and ensure GPS is on.');
        setIsTracking(false);
      }
    }, FALLBACK_TIMEOUT_MS);

    watchIdRef.current = navigator.geolocation.watchPosition(
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
        } else if (accuracy <= MAX_ACCURACY && bestFixRef.current.accuracy === accuracy) {
          if (!location || location.accuracy > accuracy) {
            setLocation(newLocation);
            setError(null);
            setAccuracyWarning(`GPS accuracy is ${Math.round(accuracy)}m. Improving...`);
          }
        }
      },
      (err) => {
        if (err.code === err.TIMEOUT) {
          return;
        }
        
        let errorMessage = 'Unable to get your location. ';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
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
        maximumAge: 5000,
        timeout: POSITION_TIMEOUT,
      }
    );
  }, [stopTracking]);

  const requestLocation = useCallback(() => {
    startTracking();
  }, [startTracking]);

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  return { location, error, isTracking, accuracyWarning, requestLocation };
}
