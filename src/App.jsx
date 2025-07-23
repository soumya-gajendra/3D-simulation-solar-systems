import React, { useRef, useState, useEffect } from 'react';
import SolarSystemCanvas from './SolarSystemCanvas.jsx';
import SpeedControls from './SpeedControls.jsx';

function App() {
    const solarSystemRef = useRef(null);
    const [planetData, setPlanetData] = useState(null);
useEffect(() => {
        if (solarSystemRef.current) {
            setPlanetData(solarSystemRef.current.getPlanetData());
        }
    }, []);
const handleSpeedChange = (planetName, speed) => {
        if (solarSystemRef.current) {
            solarSystemRef.current.setPlanetOrbitSpeed(planetName, speed);
        }
    };
 const handlePauseResume = (isPaused) => {
        if (solarSystemRef.current) {
            if (isPaused) {
                solarSystemRef.current.pauseAnimation();
            } else {
                solarSystemRef.current.resumeAnimation();
            }
        }
    };
const handleToggleDarkLight = (isDark) => {
        if (solarSystemRef.current) {
            solarSystemRef.current.toggleBackground(isDark);
        }
    };
 const handleZoom = (zoomFactor) => {
        if (solarSystemRef.current) {
            solarSystemRef.current.zoomCamera(zoomFactor);
        }
    };
 return (
        <div className="relative w-screen h-screen bg-black font-sans">
            <SolarSystemCanvas ref={solarSystemRef} />
            <SpeedControls
                onSpeedChange={handleSpeedChange}
                planetData={planetData}
                onPauseResume={handlePauseResume}
                onToggleDarkLight={handleToggleDarkLight}
                onZoom={handleZoom}
            />
            
        </div>
    );
}

export default App;