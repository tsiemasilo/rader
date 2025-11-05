import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { UserLocation, PoliceLocation } from '../types';
import 'leaflet/dist/leaflet.css';

const carIcon = L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="font-size: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🚗</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
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
}

export function MapView({ userLocation, policeLocations }: MapViewProps) {
  const center: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [40.7589, -73.9851];

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={20}
      />
      
      {userLocation && (
        <>
          <MapUpdater center={[userLocation.latitude, userLocation.longitude]} />
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={carIcon}>
            <Popup>
              <strong>Your Location</strong>
              <br />
              Accuracy: ±{Math.round(userLocation.accuracy)}m
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={userLocation.accuracy}
            pathOptions={{ color: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.15, weight: 2 }}
          />
        </>
      )}

      {policeLocations.map((location) => (
        <div key={location.id}>
          {location.isPermanent && location.radius && (
            <Circle
              center={[location.latitude, location.longitude]}
              radius={location.radius}
              pathOptions={{
                color: location.type === 'speed_camera' ? '#FF6B35' : location.type === 'police' ? '#EA4335' : '#9C27B0',
                fillColor: location.type === 'speed_camera' ? '#FF6B35' : location.type === 'police' ? '#EA4335' : '#9C27B0',
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 5'
              }}
            />
          )}
          <Marker
            position={[location.latitude, location.longitude]}
            icon={getIconForType(location.type)}
          >
            <Popup>
              <div>
                <strong>{location.type.replace('_', ' ').toUpperCase()}</strong>
                <br />
                {location.description}
                {location.isPermanent && (
                  <>
                    <br />
                    <small style={{color: '#EA4335', fontWeight: 'bold'}}>⚠️ Permanent Location</small>
                    {location.radius && (
                      <>
                        <br />
                        <small>Detection Zone: ~{location.radius}m radius</small>
                      </>
                    )}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}
