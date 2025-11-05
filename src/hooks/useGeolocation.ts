import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocation } from '../types';

const HIGH_ACCURACY_THRESHOLD = 30;
const POSITION_TIMEOUT = 60000;
const MAX_WAIT_TIME = 60000;

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);
  
  const timeoutRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const bestAccuracySeen = useRef<number>(Infinity);

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
    setAccuracyWarning('Acquiring GPS lock... Please wait for accurate position.');
    bestAccuracySeen.current = Infinity;

    timeoutRef.current = setTimeout(() => {
      if (!location) {
        setError('Unable to get accurate GPS location. Please ensure GPS is enabled and you are outdoors for best results.');
        setIsTracking(false);
        setAccuracyWarning(null);
      }
    }, MAX_WAIT_TIME);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        
        bestAccuracySeen.current = Math.min(bestAccuracySeen.current, accuracy);

        if (accuracy <= HIGH_ACCURACY_THRESHOLD) {
          const newLocation: UserLocation = {
            latitude,
            longitude,
            accuracy,
            heading: heading ?? undefined,
            speed: speed ?? undefined,
          };

          setLocation(newLocation);
          setError(null);
          setAccuracyWarning(null);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        } else {
          setAccuracyWarning(
            `GPS accuracy: ${Math.round(accuracy)}m (best: ${Math.round(bestAccuracySeen.current)}m). Waiting for better signal...`
          );
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
            errorMessage += 'Location information is unavailable. Please ensure GPS is enabled.';
            break;
          default:
            errorMessage += err.message;
        }
        
        setError(errorMessage);
        setIsTracking(false);
        setAccuracyWarning(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: POSITION_TIMEOUT,
      }
    );
  }, [stopTracking, location]);

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
