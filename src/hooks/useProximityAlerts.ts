import { useState, useEffect } from 'react';
import { UserLocation, PoliceLocation, ProximityAlert } from '../types';
import { calculateDistance, calculateBearing, getBeepInterval } from '../utils/geolocation';
import { audioManager } from '../utils/audio';

export function useProximityAlerts(
  userLocation: UserLocation | null,
  policeLocations: PoliceLocation[]
) {
  const [alerts, setAlerts] = useState<ProximityAlert[]>([]);
  const [closestAlert, setClosestAlert] = useState<ProximityAlert | null>(null);

  useEffect(() => {
    if (!userLocation) {
      setAlerts([]);
      setClosestAlert(null);
      audioManager.stopProximityAlert();
      return;
    }

    const newAlerts: ProximityAlert[] = policeLocations
      .map((location) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        );
        const bearing = calculateBearing(
          userLocation.latitude,
          userLocation.longitude,
          location.latitude,
          location.longitude
        );

        return { location, distance, bearing };
      })
      .filter((alert) => alert.distance < 2000)
      .sort((a, b) => a.distance - b.distance);

    setAlerts(newAlerts);

    const closest = newAlerts[0] || null;
    setClosestAlert(closest);

    if (closest) {
      const interval = getBeepInterval(closest.distance);
      audioManager.startProximityAlert(interval);
    } else {
      audioManager.stopProximityAlert();
    }
  }, [userLocation, policeLocations]);

  return { alerts, closestAlert };
}
