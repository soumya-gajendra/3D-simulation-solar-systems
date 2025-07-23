import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import threeSceneManager from './three-scene-manager.jsx';

const SolarSystemCanvas = forwardRef((props, ref) => {
    const mountRef = useRef(null);

    useImperativeHandle(ref, () => ({
        
        setPlanetOrbitSpeed: threeSceneManager.setPlanetOrbitSpeed.bind(threeSceneManager),
        pauseAnimation: threeSceneManager.pause.bind(threeSceneManager),
        resumeAnimation: threeSceneManager.resume.bind(threeSceneManager),
        toggleBackground: threeSceneManager.toggleBackground.bind(threeSceneManager),
        zoomCamera: threeSceneManager.zoomCamera.bind(threeSceneManager),
        getPlanetData: () => threeSceneManager.PLANET_DATA
    }));

    useEffect(() => {
        if (mountRef.current) {
            threeSceneManager.init(mountRef.current);
           
            threeSceneManager.toggleBackground(true);
        }

        return () => {
            threeSceneManager.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="w-full h-full absolute top-0 left-0 z-0" 
        ></div>
    );
});

export default SolarSystemCanvas;