import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { UserLocation, PoliceLocation } from '../types';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const policeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const cameraIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const roadblockIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function getIconForType(type: PoliceLocation['type']) {
  switch (type) {
    case 'police':
    case 'mobile_camera':
      return policeIcon;
    case 'speed_camera':
      return cameraIcon;
    case 'roadblock':
      return roadblockIcon;
    default:
      return policeIcon;
  }
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

interface MapViewProps {
  userLocation: UserLocation | null;
  policeLocations: PoliceLocation[];
  onMapClick?: (lat: number, lng: number) => void;
}

export function MapView({ userLocation, policeLocations, onMapClick }: MapViewProps) {
  const center: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [40.7128, -74.006];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && (
        <>
          <MapUpdater center={[userLocation.latitude, userLocation.longitude]} />
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Your Location</Popup>
          </Marker>
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={userLocation.accuracy}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />
        </>
      )}

      {policeLocations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={getIconForType(location.type)}
        >
          <Popup>
            <div>
              <strong>{location.type.replace('_', ' ').toUpperCase()}</strong>
              <br />
              {location.description}
              <br />
              <small>Reported: {new Date(location.timestamp).toLocaleString()}</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
