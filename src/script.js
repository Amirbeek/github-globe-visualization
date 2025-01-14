import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeGlobe from 'three-globe';
import countries from './files/custom.geo.json';
import lines from './files/lines.json';
import Map from './files/map.json';
import Flight from './files/Flight.json';
import simulateFlightData from "./FetchingFlightData";
import * as dat from 'lil-gui';

/**
 * Base
 */

// Debug
const gui = new dat.GUI();
const params = {
    rotationSpeed: 0.01,
    showGUI: true
};

gui.add(params, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
gui.add(params, 'showGUI').name('Show GUI').onChange(value => {
    gui.domElement.style.display = value ? '' : 'none';
});
const parameters = {
    globeColor: 0x3a228a,
    emissiveColor: 0x220038,
    emissiveIntensity: 1,
    shininess: 0.7,
    ambientLightIntensity: 1,
    directionalLightIntensity: 2,
    pointLightIntensity: 0.5,
    lightPositionX: -800,
    lightPositionY: 2000,
    lightPositionZ: 400,
    rotateSpeed: 0.8,
    zoomSpeed: 1,
    lightPositionX2: -400,
    lightPositionY2: 2000,
    lightPositionZ2: 300,
};

// Lights and Shadows update
const lightFolder = gui.addFolder('Light Settings');
lightFolder.add(parameters, 'ambientLightIntensity', 0, 1).name('Ambient Light Intensity').onChange(updateLights);
lightFolder.add(parameters, 'directionalLightIntensity', 0, 4).name('Directional Light Intensity').onChange(updateLights);
lightFolder.add(parameters, 'pointLightIntensity', 0, 1).name('Point Light Intensity').onChange(updateLights);
lightFolder.add(parameters, 'lightPositionX', -2000, 2000).name('Light Position X').onChange(updateLights);
lightFolder.add(parameters, 'lightPositionY', -2000, 4000).name('Light Position Y').onChange(updateLights);
lightFolder.add(parameters, 'lightPositionZ', -2000, 4000).name('Light Position Z').onChange(updateLights);
lightFolder.open();

// Globe settings
const globeFolder = gui.addFolder('Globe Settings');
globeFolder.add(parameters, 'globeColor').name('Globe Color').onChange(updateGlobe);
globeFolder.add(parameters, 'emissiveColor').name('Emissive Color').onChange(updateGlobe);
globeFolder.add(parameters, 'emissiveIntensity', 0, 2).name('Emissive Intensity').onChange(updateGlobe);
globeFolder.add(parameters, 'shininess', 0, 100).name('Shininess').onChange(updateGlobe);
globeFolder.open();

/**
 * Base
 */
let mouseX = 0, mouseY = 0;
let camera, controls, renderer, scene, Globe;
const canvas = document.querySelector('canvas.webgl');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

let windowHalfX = sizes.width / 2;
let windowHalfY = sizes.height / 2;

// Initialize
init();
initGlobe();
onWindowResize();
animate();
onMouseMove();

/**
 * Initialize scene, renderer, camera, controls, and lighting
 */
function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    scene = new THREE.Scene();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xbbbbbb, parameters.ambientLightIntensity);

    const directionalLight = new THREE.DirectionalLight(0xffffff, parameters.directionalLightIntensity);
    directionalLight.position.set(parameters.lightPositionX, parameters.lightPositionY, parameters.lightPositionZ).normalize();
    directionalLight.castShadow = true;

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, parameters.directionalLightIntensity);
    directionalLight.position.set(parameters.lightPositionX, parameters.lightPositionY, parameters.lightPositionZ).normalize();
    directionalLight.castShadow = true;

    const pointLight = new THREE.PointLight(0x8566cc, parameters.pointLightIntensity);
    pointLight.position.set(-400, 500, 200);

    scene.add(ambientLight, directionalLight, directionalLight2, pointLight)
    // Camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
    camera.position.set(300, 0, 0);
    camera.updateProjectionMatrix();
    scene.add(camera);


    const cameraFolder = gui.addFolder('Camera Position');
    cameraFolder.add(camera.position, 'x', 0, 1000);
    cameraFolder.add(camera.position, 'y', 0, 1000);
    cameraFolder.add(camera.position, 'z', 0, 1000);
    cameraFolder.open();
    // Fog
    scene.fog = new THREE.Fog(0x535ef3, 400, 2000);
    scene.background = new THREE.Color(0x040d21);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dynamicDampingFactor = 0.01;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.rotateSpeed = parameters.rotateSpeed;
    controls.zoomSpeed = parameters.zoomSpeed;
    controls.autoRotate = false;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

/**
 * Initialize Globe
 */
function initGlobe() {
    Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animation: true
    })
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor('#3a228a')
        .atmosphereAltitude(0.50);

    // Set up arcs, labels, and points data
    setTimeout(() => {
        Globe.arcsData(lines.pulls.map((pull) => ({
            ...pull,
            startLat: parseFloat(pull.startLat),
            startLng: parseFloat(pull.startLng),
            endLat: parseFloat(pull.endLat),
            endLng: parseFloat(pull.endLng),
        })))
            .arcColor((e) => e.status ? "#9cff00" : "#fff")
            .arcAltitude((e) => e.arcAlt)
            .arcStroke((e) => e.status ? 0.5 : 0.3)
            .arcDashLength(0.9)
            .arcDashGap(4)
            .arcDashAnimateTime(1000)
            .arcsTransitionDuration(1000)
            .arcDashInitialGap((e) => e.order * 1);

        Globe.labelsData(Map.maps.map((map) => ({
            ...map,
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lng),
        })))
            .labelColor(() => "#ffcb21")
            .labelDotRadius(0.3)
            .labelSize((e) => e.size)
            .labelText("city")
            .labelResolution(6)
            .labelAltitude(0.01);

        Globe.pointsData(Map.maps.map((map) => ({
            ...map,
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lng),
        })))
            .pointColor(() => "#fff")
            .pointsMerge(true)
            .pointAltitude(0.07)
            .pointRadius(0.05);
    }, 1000);

    // Set globe rotation
    Globe.rotateX(-Math.PI * (5 / 9));
    Globe.rotateY(-Math.PI * 6);

    // Globe Material
    updateGlobe();

    // Simulate flight data
    simulateFlightData(Flight, Globe);

    scene.add(Globe);
}

/**
 * Update Lights based on the parameters
 */
function updateLights() {
    scene.children.forEach(child => {
        if (child instanceof THREE.DirectionalLight) {
            child.intensity = parameters.directionalLightIntensity;
            child.position.set(parameters.lightPositionX, parameters.lightPositionY, parameters.lightPositionZ);
        }
        if (child instanceof THREE.AmbientLight) {
            child.intensity = parameters.ambientLightIntensity;
        }
        if (child instanceof THREE.PointLight) {
            child.intensity = parameters.pointLightIntensity;
        }
    });
}

/**
 * Update Globe Material based on the parameters
 */
function updateGlobe() {
    const globeMaterial = Globe.globeMaterial();
    globeMaterial.color.set(parameters.globeColor);
    globeMaterial.emissive.set(parameters.emissiveColor);
    globeMaterial.emissiveIntensity = parameters.emissiveIntensity;
    globeMaterial.shininess = parameters.shininess;
    globeMaterial.needsUpdate = true;
    globeMaterial.transparent = true;

    // globeMaterial.wireframe = true;

}

/**
 * Handle mouse move for camera adjustments
 */
function onMouseMove(event) {
    if (event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }
}

/**
 * Handle window resize
 */
function onWindowResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    canvas.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    windowHalfX = sizes.width / 2;
    windowHalfY = sizes.height / 2;
    renderer.setSize(sizes.width, sizes.height);
}

/**
 * Animate the scene and render the camera view
 */
function animate() {
    camera.position.x += Math.abs(mouseX) <= windowHalfX / 2 ? (mouseX / 2 - camera.position.x) * 0.005 : 0;
    camera.position.y += Math.abs(mouseY) <= windowHalfY / 2 ? (-mouseY / 4 - camera.position.y) * 0.005 : 0;
    // Globe.rotation.y += 0.01;
    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}