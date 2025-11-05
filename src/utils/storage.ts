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
      id: 'perm_1',
      latitude: 40.7589,
      longitude: -73.9851,
      type: 'speed_camera',
      description: 'Fixed Speed Camera - Broadway & 7th Ave',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'perm_2',
      latitude: 40.7614,
      longitude: -73.9776,
      type: 'speed_camera',
      description: 'Red Light Camera - E 42nd St',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 150,
    },
    {
      id: 'perm_3',
      latitude: 40.7484,
      longitude: -73.9857,
      type: 'police',
      description: 'Common Police Patrol Area - Empire State Vicinity',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 300,
    },
    {
      id: 'perm_4',
      latitude: 40.7580,
      longitude: -73.9855,
      type: 'speed_camera',
      description: 'Fixed Speed Camera - 8th Ave & W 47th St',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 180,
    },
    {
      id: 'perm_5',
      latitude: 40.7629,
      longitude: -73.9808,
      type: 'speed_camera',
      description: 'School Zone Camera - Near Bryant Park',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 250,
    },
    {
      id: 'perm_6',
      latitude: 40.7549,
      longitude: -73.9840,
      type: 'roadblock',
      description: 'Frequent Checkpoint Location - 9th Ave',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'perm_7',
      latitude: 40.7678,
      longitude: -73.9812,
      type: 'speed_camera',
      description: 'Fixed Speed Camera - Columbus Circle',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 220,
    },
    {
      id: 'perm_8',
      latitude: 40.7527,
      longitude: -73.9772,
      type: 'police',
      description: 'Police Station Vicinity - Midtown South',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 350,
    },
  ];
}
