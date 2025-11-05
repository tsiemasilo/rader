export interface PoliceLocation {
  id: string;
  latitude: number;
  longitude: number;
  type: 'police' | 'speed_camera' | 'roadblock' | 'mobile_camera';
  description: string;
  timestamp: number;
  isPermanent?: boolean;
  radius?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
  speed?: number;
}

export interface ProximityAlert {
  location: PoliceLocation;
  distance: number;
  bearing: number;
}
