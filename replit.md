# Police Radar Detector App - Replit Project

## Overview
A responsive web application for detecting police, speed cameras, and roadblocks while driving. Built with React, TypeScript, and Leaflet.js, featuring real-time GPS tracking, proximity alerts, and a radar scanner UI mode.

## Recent Changes
- **2025-11-05**: Live scanning mode update
  - Converted to live GPS scanning (removed user reporting system)
  - Upgraded to Google Maps-style clean tiles (CARTO Voyager)
  - Increased map zoom from 13 to 17 for clear street view
  - Added red car emoji icon for user location marker
  - Implemented permanent speed camera database with 8 NYC locations
  - Added colored radius circles showing threat detection zones
  - Updated UI to display "Live Scanning" mode
  - Fixed Vite HMR refresh loop issue by disabling HMR

- **2025-11-05**: Initial project setup
  - Created React + Vite + TypeScript application
  - Implemented GPS tracking with HTML5 Geolocation API
  - Built interactive map view with Leaflet.js
  - Created animated radar scanner UI
  - Implemented proximity-based audio alerts
  - Configured for Replit deployment on port 5000

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Mapping**: Leaflet.js + react-leaflet
- **Styling**: CSS with responsive design
- **GPS**: HTML5 Geolocation API
- **Audio**: Web Audio API
- **Storage**: Browser localStorage

### Key Components
1. **MapView**: Interactive map with Google Maps-style tiles, showing user location (car icon) and permanent threat markers with radius zones
2. **RadarView**: Animated radar scanner with proximity detection
3. **ControlPanel**: Status display with live scanning mode and radar toggle

### Custom Hooks
- `useGeolocation`: Manages real-time GPS tracking
- `useProximityAlerts`: Calculates distances and triggers alerts

### Utilities
- `geolocation.ts`: Distance/bearing calculations (Haversine formula)
- `storage.ts`: localStorage management for police locations
- `audio.ts`: Audio notification system with proximity-based beeping

## Configuration

### Vite Configuration
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Port**: 5000 (only port exposed for webview)
- **HMR**: Configured for Replit environment

### Deployment
- **Type**: Autoscale (stateless web app)
- **Build**: `npm run build`
- **Run**: Vite preview server on port 5000

## Development Workflow

### Running Locally
```bash
npm install
npm run dev
```
App runs on http://0.0.0.0:5000

### Building for Production
```bash
npm run build
npm run preview
```

### Testing GPS
- Requires HTTPS or localhost
- Browser will prompt for location permissions
- Best tested on actual mobile devices

## User Preferences

### Code Style
- TypeScript strict mode enabled
- Functional React components (no classes)
- CSS modules for component styling
- Descriptive variable names
- Type-safe implementations

### Features Priority
1. GPS accuracy and reliability
2. Audio alert system
3. Responsive mobile design
4. Radar scanner animation
5. User-friendly reporting interface

## Known Limitations

### Technical
- Web apps cannot integrate with Apple CarPlay (requires native iOS development)
- GPS accuracy varies (3-10m typical, worse indoors)
- Continuous GPS usage drains battery
- No actual radar hardware detection (GPS-based only)

### Legal
- Radar detectors illegal in some jurisdictions
- User responsible for legal compliance

## Mobile Optimization

### Responsive Design
- Mobile-first CSS approach
- Touch-friendly buttons (min 44px)
- Viewport configured for iOS/Android
- Apple mobile web app capable

### Performance
- Lazy loading for map tiles
- Efficient GPS update intervals
- LocalStorage for offline data
- Minimal re-renders with React optimization

## Future Enhancements
- Backend server for real-time data sharing across users
- User authentication system
- Voting/verification for reported locations
- Auto-expire old reports (e.g., mobile police units)
- Native iOS app for true CarPlay integration
- Android Auto support
- Speed limit warnings
- Traffic data integration

## Resources

### Documentation
- [Leaflet.js Docs](https://leafletjs.com/)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Apple CarPlay Guide](https://developer.apple.com/carplay/) (for future native development)

### APIs Used
- OpenStreetMap tile servers
- HTML5 Geolocation API
- Web Audio API

## Notes for Development
- Always test on actual mobile devices (GPS behavior differs)
- Check browser console for geolocation errors
- Verify HTTPS for production (required for GPS)
- Monitor battery usage during development
- Test in different GPS environments (indoor, outdoor, urban, rural)

---

Last Updated: 2025-11-05
