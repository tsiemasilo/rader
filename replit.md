# Police Radar Detector App - Replit Project

## Overview
A responsive web application designed to detect police, speed cameras, and roadblocks in real-time for drivers. Built with React, TypeScript, and Leaflet.js, the application features GPS tracking, proximity alerts, and a radar scanner user interface. The project aims to provide drivers with situational awareness to enhance road safety and compliance.

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

## System Architecture
### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Mapping**: Leaflet.js + react-leaflet
- **Styling**: CSS with responsive design
- **GPS**: HTML5 Geolocation API
- **Audio**: Web Audio API
- **Storage**: Browser localStorage

### UI/UX Decisions
- **Themes**: Switchable light (CARTO Voyager) and dark (CARTO Dark) modes with localStorage persistence.
- **Mobile Optimization**: Mobile-first CSS, touch-friendly buttons, viewport configuration for iOS/Android, Apple mobile web app capable.
- **GPS Loading Indicator**: Animated spinner with "Acquiring GPS Location..." message to prevent confusion during GPS acquisition.
- **Split-Screen Map View**: When threats are detected, the map splits into two sections: ThreatsSidebar (30%) and Interactive map (70%) with directional arrows and color-coded distance indicators.
- **Radar View**: Animated radar scanner with a semi-transparent background map for situational awareness. Control panel is hidden in radar mode for an unobstructed view.
- **Responsive Burger Menu**: Houses Radar View toggle, Light/Dark theme toggle, and location request, optimized for mobile UX.

### Key Features
- **Real-time GPS Tracking**: Utilizes HTML5 Geolocation API with improved accuracy filtering and robust error handling.
- **Proximity Alerts**: Audio notifications triggered based on distance to detected threats.
- **Threat Display**: User location (car icon) and permanent threat markers with radius zones on the map.
- **Location Permission Handling**: User-triggered geolocation requests, especially for iOS Safari, with a dedicated permission request screen and recovery instructions.
- **Dark Mode**: Configured to use lighter grey tones for better visibility while maintaining visual coherence.

### System Design Choices
- **Geolocation Reliability**: Two-step approach (`getCurrentPosition` then `watchPosition`) for reliable browser permission prompts. Immediate acceptance of GPS position regardless of initial accuracy, with smart accuracy warnings.
- **Performance**: Lazy loading for map tiles, efficient GPS update intervals, localStorage for offline data, and minimal re-renders.
- **Configurable Locations**: Pre-defined police and speed camera locations in Johannesburg, Cape Town, and Pretoria, South Africa.

## External Dependencies
- **Mapping Services**: OpenStreetMap tile servers
- **Geolocation**: HTML5 Geolocation API
- **Audio**: Web Audio API