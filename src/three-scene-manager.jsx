import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
class ThreeSceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planets = {};
        this.planetGroups = [];
        this.animationFrameId = null;
        this.clock = new THREE.Clock();
        this.textureLoader = new THREE.TextureLoader();
        this.SOLAR_SYSTEM_RADIUS_SCALE = 120;
        this.SUN_RADIUS = 8;
         this.PLANET_DATA = {
            mercury: { radius: 1, distance: 15, texture: '8k_mercury.jpg',orbitSpeed: 0.005, rotationSpeed: 0.02 },
            venus: { radius: 1.5, distance: 25, texture: '8k_venus_surface.jpg',orbitSpeed: 0.004, rotationSpeed: 0.015 },
            earth: {
                radius: 1.8, distance: 35, texture: '8k_earth_daymap.jpg',
                clouds: 'earth_clouds.png', orbitSpeed: 0.003, rotationSpeed: 0.03
            },
            mars: { radius: 1.2, distance: 45, texture: '8k_mars.jpg',orbitSpeed: 0.0025, rotationSpeed: 0.025 },
            jupiter: { radius: 4.5, distance: 70, texture: '8k_jupiter.jpg',orbitSpeed: 0.0015, rotationSpeed: 0.04 },
            saturn: {
                radius: 3.8, distance: 90, texture: '8k_saturn.jpg',
                ringInnerRadius: 4.5, ringOuterRadius: 8, ringTexture: '8k_saturn_ring_alpha.png', orbitSpeed: 0.0012, rotationSpeed: 0.035
            },
            uranus: { radius: 3.0, distance: 105, texture: '2k_uranus.jpg',orbitSpeed: 0.0010, rotationSpeed: 0.03 },
            neptune: { radius: 2.8, distance: 120, texture: '2k_neptune.jpg',orbitSpeed: 0.0009, rotationSpeed: 0.028 },
        };
    }

    init(container) {
       this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 20;
        this.controls.maxDistance = this.SOLAR_SYSTEM_RADIUS_SCALE * 1.5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.addLighting();
        this.addSun();
        this.addPlanets();
        this.addStars();
        this.addOrbitLines();
        this.camera.position.set(0, this.SOLAR_SYSTEM_RADIUS_SCALE * 0.7, this.SOLAR_SYSTEM_RADIUS_SCALE * 1.2);
        this.camera.lookAt(0, 0, 0);
        this.onResize = () => this.handleResize(container);
        window.addEventListener('resize', this.onResize);
        this.animate();
    }
    addLighting() {
        this.scene.add(new THREE.AmbientLight(0x333333));
        const sunLight = new THREE.PointLight(0xFFFFFF, 1.5, 0, 2);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
    }
    addSun() {
        const sunGeometry = new THREE.SphereGeometry(this.SUN_RADIUS, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            map: this.textureLoader.load('8k_sun.jpg')
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(sun);

        const pointLight = new THREE.PointLight(0xFFFFF0, 10, 0, 0);
        sun.add(pointLight);
    }
    addPlanets() {
        Object.entries(this.PLANET_DATA).forEach(([name, data]) => {
            const planetGroup = new THREE.Group(); 
            this.scene.add(planetGroup);
            const planetGeometry = new THREE.SphereGeometry(data.radius, 64, 64);
            const materialOptions = {
                map: this.textureLoader.load(`${data.texture}`),
            };
             const planetMaterial = new THREE.MeshStandardMaterial(materialOptions);
            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.position.set(data.distance, 0, 0);
            planetGroup.add(planetMesh); 
            if (name === 'saturn' && data.ringTexture) {
                const ringGeometry = new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 64);
                const ringTexture = this.textureLoader.load(`${data.ringTexture}`);
                const ringMaterial = new THREE.MeshStandardMaterial({
                    map: ringTexture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8,
                });
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.rotation.x = -Math.PI / 2;
                ringMesh.rotation.y = Math.PI / 10;
                planetMesh.add(ringMesh);
            }
            this.planets[name] = {
                mesh: planetMesh,
                group: planetGroup,
                distance: data.distance,
                orbitSpeed: data.orbitSpeed,
                rotationSpeed: data.rotationSpeed,
                currentAngle: Math.random() * Math.PI * 2
            };
            this.planetGroups.push(this.planets[name]);
        });
    }
     addStars() {
        const starTexture = this.textureLoader.load('8k_stars_milky_way.jpg');
        const starGeometry = new THREE.SphereGeometry(this.SOLAR_SYSTEM_RADIUS_SCALE * 2, 32, 32);
        const starMaterial = new THREE.MeshBasicMaterial({
            map: starTexture,
            side: THREE.BackSide,
        });
        const stars = new THREE.Mesh(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    addOrbitLines() {
        Object.entries(this.PLANET_DATA).forEach(([name, data]) => {
            const curve = new THREE.EllipseCurve(
                0, 0,
                data.distance, data.distance,
                0, 2 * Math.PI,
                false,
                0
            );
            const points = curve.getPoints(100);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0x555555, opacity: 0.4, transparent: true });
            const orbitLine = new THREE.Line(geometry, material);
            orbitLine.rotation.x = Math.PI / 2;
            this.scene.add(orbitLine);
        });
    }
    setPlanetOrbitSpeed(planetName, speed) {
        if (this.planets[planetName]) {
            this.planets[planetName].orbitSpeed = speed;
        }
    }
    handleResize(container) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    animate = () => {
        const delta = this.clock.getDelta();
            this.planetGroups.forEach(planet => {
            planet.currentAngle += planet.orbitSpeed * delta * 50;
            planet.group.rotation.y = planet.currentAngle;
            planet.mesh.rotation.y += planet.rotationSpeed * delta * 10;
        });
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(this.animate);
    }
    pause() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    resume() {
        if (!this.animationFrameId) {
            this.animate();
        }
    }
    toggleBackground(isDark) {
        this.renderer.setClearColor(isDark ? 0x000000 : 0xEEEEEE, 1);
    }
    zoomCamera(zoomFactor) {
        if (this.controls) {
            this.controls.dollyOut(zoomFactor);
            this.controls.update();
        }
    }
    dispose() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.onResize);
       if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        this.scene.traverse((object) => {
            if (object.isMesh || object.isLine || object.isPoints || object.isSprite) {
                object.geometry?.dispose();
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material?.dispose();
                }
            }
        });
        this.scene.clear();
        this.planets = {};
        this.planetGroups = [];
    }
}
const threeSceneManager = new ThreeSceneManager();
export default threeSceneManager;