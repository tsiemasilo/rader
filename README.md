# Police & Radar Detector App 🚔📡

A responsive web application similar to Waze that detects and alerts you about police, roadblocks, speed cameras, and radar zones while driving. Features real-time GPS tracking, proximity alerts with audio notifications, and a radar scanner UI mode.

## 🌟 Features

### Core Functionality
- **Real-time GPS Tracking**: Continuously tracks your location while driving
- **Interactive Map View**: Shows your current location and nearby police/camera locations on an OpenStreetMap
- **Radar Scanner Mode**: Animated radar UI that scans for nearby threats with visual indicators
- **Proximity Audio Alerts**: Beeping notifications that increase in frequency as you approach police/cameras
- **Distance-Based Warnings**: 
  - 🔴 URGENT (< 100m): Fast beeping, red alert
  - 🟠 WARNING (100-500m): Medium beeping, orange alert  
  - 🟡 INFO (500-1000m): Slow beeping, yellow alert
- **Crowdsourced Reporting**: Users can report new police/camera locations in real-time
- **Persistent Storage**: Locations are saved to browser localStorage

### Detection Types
- 🚓 Police Officers
- 📷 Fixed Speed Cameras
- 📹 Mobile Speed Cameras
- 🚧 Roadblocks

### UI Modes
1. **Map View**: Traditional map with markers showing police locations
2. **Radar View**: Animated radar scanner with proximity detection

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- Modern web browser with GPS support
- HTTPS connection (required for geolocation)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd police-radar-detector
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Mobile Usage

### iPhone/Android Browser
1. Open the app URL in your mobile browser
2. Grant location permissions when prompted
3. Add to home screen for app-like experience:
   - **iOS**: Tap Share → Add to Home Screen
   - **Android**: Menu → Add to Home Screen

### Using While Driving
⚠️ **SAFETY FIRST**: 
- Set up the app BEFORE starting to drive
- Mount your phone securely
- Grant location permissions
- Enable audio alerts
- Do NOT interact with the app while driving

## 🍎 Apple CarPlay Integration

### Important Limitation
**CarPlay does NOT support web apps.** This is a web application that runs in your phone's browser. To get true CarPlay integration, you would need to:

1. **Build a Native iOS App** using Swift/Objective-C
2. **Request CarPlay Entitlement** from Apple
3. **Use CarPlay Framework** with navigation templates
4. **Submit to App Store** for approval

### Alternative for CarPlay Users
Since you can't install this web app directly on CarPlay, here's what you can do:

1. **Use iPhone Display**:
   - Mount your iPhone where you can see it
   - Keep the app open while driving
   - Audio alerts will play through your phone or CarPlay audio

2. **Future Native App Development**:
   If you want true CarPlay integration, consider hiring an iOS developer to build a native version using:
   - **CarPlay Framework**: `import CarPlay`
   - **CPMapTemplate**: For navigation apps
   - **Core Location**: For GPS tracking
   
   Resources:
   - [Apple CarPlay Developer Guide](https://developer.apple.com/carplay/)
   - [CarPlay Entitlement Request](https://developer.apple.com/contact/carplay/)

## 🎛️ How to Use

### Map View
1. **Your Location**: Blue marker with accuracy circle
2. **Police/Cameras**: Red, orange, or purple markers
3. **Click Markers**: View details about each location
4. **Auto-Following**: Map centers on your location automatically

### Radar View
1. **Tap "📡 RADAR VIEW"** button
2. **Green Radar**: Continuously scans 360°
3. **Threat Dots**: Red/orange dots show police locations
4. **Distance Display**: Shows distance to closest threat
5. **Warning Levels**: 
   - "APPROACHING NOW!" - Less than 100m
   - "WARNING - SLOW DOWN" - 100-500m
   - "ALERT - AHEAD" - 500-1000m

### Reporting New Locations
1. **Tap "📍 REPORT"** button
2. **Select Type**: Police, Speed Camera, Mobile Camera, or Roadblock
3. **Add Description** (optional)
4. **Submit**: Location is saved at your current GPS coordinates

### Audio Alerts
- **Beep Frequency** increases as you get closer
- **Automatic scanning sound** in radar mode
- **Volume**: Use your device's volume controls

## 🔧 Technical Details

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Mapping**: Leaflet.js + OpenStreetMap
- **GPS**: HTML5 Geolocation API
- **Audio**: Web Audio API
- **Storage**: localStorage

### Key Features Implementation

#### GPS Tracking
```typescript
navigator.geolocation.watchPosition(
  callback,
  errorCallback,
  {
    enableHighAccuracy: true,  // Uses GPS
    maximumAge: 0,              // No cached positions
    timeout: 10000              // 10 second timeout
  }
);
```

#### Distance Calculation
Uses the Haversine formula to calculate distance between GPS coordinates in meters.

#### Audio System
- **Proximity Beeps**: Sine wave oscillator with variable frequency
- **Beep Interval**: 200ms (urgent) to 2000ms (distant)
- **Radar Scan Sound**: Frequency sweep from 400Hz to 1200Hz

#### Data Persistence
Locations are stored in `localStorage` under the key `police_locations` as JSON.

## 🛠️ Development

### Project Structure
```
├── src/
│   ├── components/       # React components
│   │   ├── MapView.tsx
│   │   ├── RadarView.tsx
│   │   ├── ControlPanel.tsx
│   │   └── ReportForm.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useGeolocation.ts
│   │   └── useProximityAlerts.ts
│   ├── utils/           # Utility functions
│   │   ├── geolocation.ts
│   │   ├── storage.ts
│   │   └── audio.ts
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main app component
├── index.html
├── vite.config.ts
└── package.json
```

### Key Files
- **`useGeolocation.ts`**: GPS tracking hook
- **`useProximityAlerts.ts`**: Proximity detection and alerts
- **`audio.ts`**: Audio notification system
- **`storage.ts`**: localStorage management

### Customization

#### Add More Default Locations
Edit `src/utils/storage.ts` → `getDefaultLocations()` function

#### Change Alert Distances
Edit `src/utils/geolocation.ts` → `getAlertLevel()` function

#### Modify Beep Frequency
Edit `src/utils/geolocation.ts` → `getBeepInterval()` function

## 📝 Git Setup & Version Control

### Initial Setup
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Police radar detector app"

# Add remote repository
git remote add origin <your-repo-url>

# Push to remote
git push -u origin main
```

### Before Pushing
The app is already configured with `.gitignore` to exclude:
- `node_modules/`
- `dist/`
- Build artifacts
- IDE files

### Recommended Git Workflow
```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/new-feature

# Merge back to main
git checkout main
git merge feature/new-feature
git push origin main
```

## 🚨 Important Notes

### Legal Considerations
- **Radar detectors are ILLEGAL in some jurisdictions** (e.g., Virginia, Washington D.C., parts of Europe)
- Check your local laws before using this app
- This app uses GPS-based detection, not actual radar detection hardware

### Privacy
- Location data is stored locally on your device only
- No data is sent to external servers
- User reports are stored in browser localStorage

### Limitations
1. **GPS Accuracy**: Typically 3-10m outdoors, worse indoors
2. **Battery Drain**: Continuous GPS usage drains battery quickly
3. **No Real Radar Detection**: This is GPS-based, not hardware radar detection
4. **Data Source**: Relies on crowdsourced reports and pre-loaded locations
5. **CarPlay**: Not natively supported (web app limitation)

## 🎯 Future Enhancements

Potential features to add:
- [ ] Backend server for real-time data sharing
- [ ] User authentication
- [ ] Voting system for location accuracy
- [ ] Auto-expire old reports
- [ ] Speed limit warnings
- [ ] Traffic data integration
- [ ] Turn-by-turn navigation
- [ ] Native iOS/Android apps for CarPlay/Android Auto

## 📄 License

This is a demonstration project. Ensure compliance with local laws regarding radar detectors and speed camera detection apps.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Disclaimer

This app is for educational and demonstration purposes. Always obey traffic laws and speed limits. The developers are not responsible for any traffic violations, accidents, or legal issues resulting from the use of this application.

---

**Built with ❤️ for safer driving**
