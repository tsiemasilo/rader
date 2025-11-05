import { PoliceLocation } from '../types';

const STORAGE_KEY = 'police_locations';

export function getStoredLocations(): PoliceLocation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultLocations();
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading locations:', error);
    return getDefaultLocations();
  }
}

export function saveLocation(location: PoliceLocation): void {
  try {
    const locations = getStoredLocations();
    locations.push(location);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error('Error saving location:', error);
  }
}

export function removeLocation(id: string): void {
  try {
    const locations = getStoredLocations();
    const filtered = locations.filter(loc => loc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing location:', error);
  }
}

function getDefaultLocations(): PoliceLocation[] {
  return [
    {
      id: '1',
      latitude: 40.7589,
      longitude: -73.9851,
      type: 'speed_camera',
      description: 'Speed Camera - Times Square Area',
      timestamp: Date.now(),
    },
    {
      id: '2',
      latitude: 34.0522,
      longitude: -118.2437,
      type: 'police',
      description: 'Police Checkpoint',
      timestamp: Date.now(),
    },
    {
      id: '3',
      latitude: 37.7749,
      longitude: -122.4194,
      type: 'speed_camera',
      description: 'Fixed Speed Camera',
      timestamp: Date.now(),
    },
  ];
}
