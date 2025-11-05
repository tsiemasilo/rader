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
    // Johannesburg
    {
      id: 'jhb_1',
      latitude: -26.1367,
      longitude: 28.0456,
      type: 'speed_camera',
      description: 'Speed Camera - M1 North Glenhove Rd',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'jhb_2',
      latitude: -26.1951,
      longitude: 28.0294,
      type: 'speed_camera',
      description: 'Speed Camera - M1 South Booysens',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'jhb_3',
      latitude: -26.2041,
      longitude: 28.0473,
      type: 'police',
      description: 'Johannesburg Central Police Station',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 300,
    },
    {
      id: 'jhb_4',
      latitude: -26.1076,
      longitude: 28.0567,
      type: 'speed_camera',
      description: 'Speed Camera - N1 North Buccleuch',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 250,
    },
    {
      id: 'jhb_5',
      latitude: -26.1445,
      longitude: 28.0421,
      type: 'roadblock',
      description: 'Common Roadblock - Oxford Rd Rosebank',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 180,
    },
    {
      id: 'jhb_6',
      latitude: -26.1025,
      longitude: 27.9944,
      type: 'speed_camera',
      description: 'Speed Camera - William Nicol Dr Fourways',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'jhb_7',
      latitude: -26.1337,
      longitude: 28.0887,
      type: 'roadblock',
      description: 'Roadblock Zone - Louis Botha Ave',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 220,
    },
    {
      id: 'jhb_8',
      latitude: -26.2473,
      longitude: 28.1086,
      type: 'police',
      description: 'Booysens Police Station',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 280,
    },
    {
      id: 'jhb_9',
      latitude: -26.0981,
      longitude: 28.1165,
      type: 'speed_camera',
      description: 'Speed Camera - N3 Eastbound Gillooly\'s',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'jhb_10',
      latitude: -26.2708,
      longitude: 27.8692,
      type: 'roadblock',
      description: 'Frequent Checkpoint - N1 South Diepkloof',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 250,
    },

    // Cape Town
    {
      id: 'cpt_1',
      latitude: -33.9249,
      longitude: 18.4241,
      type: 'police',
      description: 'Cape Town Central Police Station',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 320,
    },
    {
      id: 'cpt_2',
      latitude: -33.9321,
      longitude: 18.8602,
      type: 'speed_camera',
      description: 'Speed Camera - N2 Baden Powell Dr',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'cpt_3',
      latitude: -33.9608,
      longitude: 18.4968,
      type: 'speed_camera',
      description: 'Speed Camera - M3 Newlands',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 180,
    },
    {
      id: 'cpt_4',
      latitude: -33.9183,
      longitude: 18.4177,
      type: 'roadblock',
      description: 'Common Roadblock - N1 Foreshore',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 220,
    },
    {
      id: 'cpt_5',
      latitude: -34.0520,
      longitude: 18.4732,
      type: 'speed_camera',
      description: 'Speed Camera - M3 Wynberg',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'cpt_6',
      latitude: -33.9249,
      longitude: 18.6015,
      type: 'roadblock',
      description: 'Checkpoint Zone - N2 Airport Approach',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 250,
    },
    {
      id: 'cpt_7',
      latitude: -33.9685,
      longitude: 18.4673,
      type: 'police',
      description: 'Woodstock Police Station',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 300,
    },
    {
      id: 'cpt_8',
      latitude: -33.9752,
      longitude: 18.4606,
      type: 'speed_camera',
      description: 'Speed Camera - De Waal Drive Observatory',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 180,
    },
    {
      id: 'cpt_9',
      latitude: -33.8908,
      longitude: 18.6253,
      type: 'speed_camera',
      description: 'Speed Camera - N1 Brackenfell',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'cpt_10',
      latitude: -34.0039,
      longitude: 18.4904,
      type: 'roadblock',
      description: 'Roadblock Area - Main Rd Claremont',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 180,
    },

    // Pretoria
    {
      id: 'pta_1',
      latitude: -25.7479,
      longitude: 28.2293,
      type: 'police',
      description: 'Pretoria Central Police Station',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 310,
    },
    {
      id: 'pta_2',
      latitude: -25.7069,
      longitude: 28.2267,
      type: 'speed_camera',
      description: 'Speed Camera - N1 South Wonderboom',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 220,
    },
    {
      id: 'pta_3',
      latitude: -25.7545,
      longitude: 28.1877,
      type: 'speed_camera',
      description: 'Speed Camera - M2 Church St West',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'pta_4',
      latitude: -25.8653,
      longitude: 28.1894,
      type: 'roadblock',
      description: 'Checkpoint Zone - N1 South Centurion',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 250,
    },
    {
      id: 'pta_5',
      latitude: -25.7693,
      longitude: 28.2768,
      type: 'speed_camera',
      description: 'Speed Camera - N4 Eastbound Silverton',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 200,
    },
    {
      id: 'pta_6',
      latitude: -25.7615,
      longitude: 28.2999,
      type: 'police',
      description: 'Brooklyn Police Station',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 280,
    },
    {
      id: 'pta_7',
      latitude: -25.8281,
      longitude: 28.2601,
      type: 'roadblock',
      description: 'Roadblock Area - N1 Menlyn',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 220,
    },
    {
      id: 'pta_8',
      latitude: -25.7011,
      longitude: 28.1545,
      type: 'speed_camera',
      description: 'Speed Camera - R101 Montana',
      timestamp: Date.now(),
      isPermanent: true,
      radius: 190,
    },
  ];
}
