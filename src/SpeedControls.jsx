import React, { useState, useEffect } from 'react';
const SpeedControls = ({ onSpeedChange, planetData, onPauseResume, onToggleDarkLight, onZoom }) => {
    const [planetSpeeds, setPlanetSpeeds] = useState({});
    const [isPaused, setIsPaused] = useState(false);
 useEffect(() => {
        if (planetData) {
            const initialSpeeds = {}; 
            Object.keys(planetData).forEach(planetName => {
                initialSpeeds[planetName] = planetData[planetName].orbitSpeed;
            });
            setPlanetSpeeds(initialSpeeds); 
        }
    }, [planetData]);
const handleSliderChange = (planetName, event) => {
        const newSpeed = parseFloat(event.target.value);
        setPlanetSpeeds(prev => ({ ...prev, [planetName]: newSpeed }));
        onSpeedChange(planetName, newSpeed);
    };
const handlePauseResume = () => {
        setIsPaused(prev => {
            const newState = !prev;
            if (onPauseResume) {
                onPauseResume(newState);
            }
            return newState;
        });
    };
const handleToggleDarkLight = () => {
        setIsDark(prev => {
            const newState = !prev;
            if (onToggleDarkLight) {
                onToggleDarkLight(newState);
            }
            return newState;
        });
    };
 return (
        <div className="absolute top-4 left-4 p-4 bg-gray-800 bg-opacity-75 rounded-lg shadow-lg text-white z-10 max-w-xs md:max-w-md lg:max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-center">Solar System Controls</h2>
            <div className="mb-6 flex flex-col space-y-2">
                <button
                    onClick={handlePauseResume}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                >
                    {isPaused ? 'Resume Animation' : 'Pause Animation'}
                </button>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-center">Planet Orbital Speed</h3>
            <div className="space-y-4">
                {planetData && Object.entries(planetSpeeds).map(([planetName, speed]) => (
                    <div key={planetName} className="flex flex-col">
                        <label htmlFor={planetName} className="capitalize text-sm mb-1">
                            {planetName}: <span className="font-mono text-gray-300">{speed.toFixed(4)}</span>
                        </label>
                        <input
                            type="range"
                            id={planetName}
                            min="0.0001" // Min speed (can't be 0 or it stops)
                            max="0.01"  // Max speed (adjust as needed)
                            step="0.0001"
                            value={speed}
                            onChange={(e) => handleSliderChange(planetName, e)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 accent-blue-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SpeedControls;