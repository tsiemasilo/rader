import { useEffect, useState } from 'react';
import { ProximityAlert } from '../types';
import { formatDistance } from '../utils/geolocation';
import { audioManager } from '../utils/audio';
import './RadarView.css';

interface RadarViewProps {
  alerts: ProximityAlert[];
  closestAlert: ProximityAlert | null;
}

export function RadarView({ alerts, closestAlert }: RadarViewProps) {
  const [scanAngle, setScanAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanAngle((prev) => (prev + 2) % 360);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (alerts.length > 0 && scanAngle % 90 === 0) {
      audioManager.playRadarScan();
    }
  }, [scanAngle, alerts.length]);

  const getRadarPosition = (alert: ProximityAlert) => {
    const maxDistance = 2000;
    const normalizedDistance = Math.min(alert.distance / maxDistance, 1);
    const radius = (1 - normalizedDistance) * 140;
    const angleRad = (alert.bearing * Math.PI) / 180;
    
    return {
      x: 150 + radius * Math.sin(angleRad),
      y: 150 - radius * Math.cos(angleRad),
    };
  };

  return (
    <div className="radar-container">
      <svg className="radar-svg" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="140" fill="none" stroke="#00ff00" strokeWidth="1" opacity="0.3" />
        <circle cx="150" cy="150" r="100" fill="none" stroke="#00ff00" strokeWidth="1" opacity="0.3" />
        <circle cx="150" cy="150" r="60" fill="none" stroke="#00ff00" strokeWidth="1" opacity="0.3" />
        <circle cx="150" cy="150" r="20" fill="none" stroke="#00ff00" strokeWidth="1" opacity="0.3" />
        
        <line x1="150" y1="10" x2="150" y2="290" stroke="#00ff00" strokeWidth="0.5" opacity="0.2" />
        <line x1="10" y1="150" x2="290" y2="150" stroke="#00ff00" strokeWidth="0.5" opacity="0.2" />
        
        <line
          x1="150"
          y1="150"
          x2={150 + 140 * Math.sin((scanAngle * Math.PI) / 180)}
          y2={150 - 140 * Math.cos((scanAngle * Math.PI) / 180)}
          stroke="#00ff00"
          strokeWidth="2"
          opacity="0.8"
        />
        
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="#00ff00"
          strokeWidth="1"
          opacity="0.5"
        />

        {alerts.map((alert) => {
          const pos = getRadarPosition(alert);
          const isClosest = closestAlert?.location.id === alert.location.id;
          
          return (
            <g key={alert.location.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isClosest ? 6 : 4}
                fill={isClosest ? '#ff0000' : '#ff6600'}
                stroke={isClosest ? '#ff0000' : '#ff6600'}
                strokeWidth="2"
                opacity={isClosest ? 1 : 0.8}
              >
                <animate
                  attributeName="r"
                  values={isClosest ? '6;8;6' : '4;5;4'}
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
        
        <circle cx="150" cy="150" r="3" fill="#00ff00" />
      </svg>

      <div className="radar-info">
        {closestAlert ? (
          <div className="alert-panel">
            <div className="alert-type">
              {closestAlert.location.type.replace('_', ' ').toUpperCase()}
            </div>
            <div className="alert-distance">
              {formatDistance(closestAlert.distance)}
            </div>
            <div className="alert-description">
              {closestAlert.location.description}
            </div>
            <div className="alert-warning">
              {closestAlert.distance < 100 && '⚠️ APPROACHING NOW!'}
              {closestAlert.distance >= 100 && closestAlert.distance < 500 && '⚠️ WARNING - SLOW DOWN'}
              {closestAlert.distance >= 500 && 'ALERT - AHEAD'}
            </div>
          </div>
        ) : (
          <div className="no-alerts">
            <p>SCANNING...</p>
            <p className="scan-status">No threats detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
