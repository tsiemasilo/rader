import { useState, useEffect, useCallback, useRef } from 'react';
import { UserLocation } from '../types';

const GOOD_ACCURACY_THRESHOLD = 50;
const POSITION_TIMEOUT = 30000;

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

    // CRITICAL FOR iOS SAFARI: Call navigator.geolocation.getCurrentPosition 
    // IMMEDIATELY, synchronously, BEFORE any state updates or other operations.
    // iOS Safari will block the permission prompt if there are ANY operations
    // between the user gesture (button click) and this call.
    
    // Clean up any previous tracking asynchronously (doesn't block permission prompt)
    setTimeout(() => {
      stopTracking();
    }, 0);
    
    // Step 1: Request initial position to trigger permission prompt
    // This MUST be the first thing that happens!
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully got initial position
        // Now it's safe to do state updates since permission was already granted
        setIsTracking(true);
        setError(null);
        setAccuracyWarning(null);
        hasReceivedLocation.current = true;
        
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        
        const newLocation: UserLocation = {
          latitude,
          longitude,
          accuracy,
          heading: heading ?? undefined,
          speed: speed ?? undefined,
        };

        setLocation(newLocation);
        
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
        setIsTracking(false);
        
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
    // Cleanup when component unmounts
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return { location, error, isTracking, accuracyWarning, requestLocation, startTracking };
}
