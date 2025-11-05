import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocation } from '../types';

const GOOD_ACCURACY_THRESHOLD = 50;
const POSITION_TIMEOUT = 30000;
const MAX_WAIT_TIME = 15000;

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);
  
  const timeoutRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const hasReceivedLocation = useRef<boolean>(false);

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
    hasReceivedLocation.current = false;

    timeoutRef.current = setTimeout(() => {
      if (!hasReceivedLocation.current) {
        setError('Unable to get your location. Please ensure location access is enabled in your browser settings.');
        setAccuracyWarning(null);
        stopTracking();
      }
    }, MAX_WAIT_TIME);

    // Step 1: Request initial position to trigger permission prompt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully got initial position
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        
        const newLocation: UserLocation = {
          latitude,
          longitude,
          accuracy,
          heading: heading ?? undefined,
          speed: speed ?? undefined,
        };

        setLocation(newLocation);
        setError(null);
        hasReceivedLocation.current = true;
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (accuracy > GOOD_ACCURACY_THRESHOLD) {
          setAccuracyWarning(
            `GPS accuracy: ±${Math.round(accuracy)}m. Signal may improve outdoors.`
          );
        } else {
          setAccuracyWarning(null);
        }

        // Step 2: Start continuous tracking with watchPosition
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

            setLocation(newLocation);
            setError(null);

            if (accuracy > GOOD_ACCURACY_THRESHOLD) {
              setAccuracyWarning(
                `GPS accuracy: ±${Math.round(accuracy)}m. Signal may improve outdoors.`
              );
            } else {
              setAccuracyWarning(null);
            }
          },
          (err) => {
            // Ignore timeout errors as they can be transient
            if (err.code === err.TIMEOUT) {
              return;
            }
            
            let errorMessage = 'Unable to get your location. ';
            
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMessage += 'Location access was denied. Please enable location permissions in your browser settings.';
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage += 'Location information is unavailable. Please check your device settings and ensure GPS is enabled.';
                break;
              default:
                errorMessage += err.message;
            }
            
            setError(errorMessage);
            setIsTracking(false);
            setAccuracyWarning(null);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: POSITION_TIMEOUT,
          }
        );
      },
      (err) => {
        // Error getting initial position
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        let errorMessage = 'Unable to get your location. ';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Location access was denied. Please enable location permissions in your browser settings. You may need to tap the location icon in your browser\'s address bar or check your device\'s location settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable. Please check your device settings and ensure GPS/location services are enabled.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again and ensure you have a clear view of the sky if using GPS.';
            break;
          default:
            errorMessage += err.message;
        }
        
        setError(errorMessage);
        setIsTracking(false);
        setAccuracyWarning(null);
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
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
