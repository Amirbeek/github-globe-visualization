import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ThreeGlobe from 'three-globe'
import countries from './files/custom.geo.json';
import lines from './files/lines.json';
import Map from './files/map.json';

let mouseX = 0;
let mouseY = 0;
let camera, controls, renderer, scene;
const canvas = document.querySelector('canvas.webgl');
let Globe;
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
let windowHalfX = sizes.width / 2;  // Initialize windowHalfX and windowHalfY
let windowHalfY = sizes.height / 2;

init();
initGlobe();
onWindowResize();
animate();
onMouseMove();

function init() {
    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    scene = new THREE.Scene();

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);

    /**
     * Camera
     */
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
    camera.position.set(400, 0, 0);
    camera.updateProjectionMatrix();
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(-800, 2000, 400);

    const light1 = new THREE.DirectionalLight(0x7982f6, 1);
    light1.position.set(-200, 500, 200);

    const light2 = new THREE.PointLight(0x8566cc, 0.5);
    light2.position.set(-200, 500, 200);

    camera.add(light, light1, light2);

    scene.add(camera);

    scene.fog = new THREE.Fog(0x535ef3, 400, 2000);
    scene.background = new THREE.Color(0x040d21);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dynamicDampingFactor = 0.01;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.autoRotate = false;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

function initGlobe() {
    /**
     * Objects
     */
    Globe = new ThreeGlobe({
        waitForGlobeReady: true,
        animation: true
    })
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(true)
        .atmosphereColor('#3a228a')
        .atmosphereAltitude(0.25)

    // Convert lat/lng strings to numbers and generate arcs and labels
    setTimeout(() => {
        Globe.arcsData(lines.pulls.map(pull => ({
            ...pull,
            startLat: parseFloat(pull.startLat),
            startLng: parseFloat(pull.startLng),
            endLat: parseFloat(pull.endLat),
            endLng: parseFloat(pull.endLng)
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
            lng: parseFloat(map.lng)
        })))
            .labelColor(() => '#ffcb21')
            .labelDotRadius(0.3)
            .labelSize((e) => e.size)
            .labelText('city')
            .labelResolution(6)
            .labelAltitude(0.01);

        Globe.pointsData(Map.maps.map((map) => ({
            ...map,
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lng)
        })))
            .pointColor(() => '#fff')
            .pointsMerge(true)
            .pointAltitude(0.07)
            .pointRadius(0.05);
    }, 1000);

    Globe.rotateX(-Math.PI * (5 / 9));
    Globe.rotateY(-Math.PI * 6);

    const globeMaterial = Globe.globeMaterial();
    globeMaterial.color = new THREE.Color(0x3a228a);
    globeMaterial.emissive = new THREE.Color(0x220038);
    globeMaterial.emissiveIntensity = 1;
    globeMaterial.shininess = 0.7;

    scene.add(Globe);
    // Fetch city data from OpenCage API (replace with your actual API key)
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=London&key=3be1fd32756a4b6e8e2f3a4beb226d32`)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            // Log the entire response data to the console
            console.log("API Response:", data);

            // Log the specific result (city, country, lat, lng)
            if (data.results && data.results.length > 0) {
                const city = data.results[0];
                console.log("City:", city.formatted); // City name (full address)
                console.log("Country:", city.components.country); // Country name
                console.log("Latitude:", city.geometry.lat); // Latitude
                console.log("Longitude:", city.geometry.lng); // Longitude
            } else {
                console.log("No results found.");
            }
        })
        .catch(error => {
            console.error('Error fetching data from OpenCage:', error);  // Handle errors
        });

}

function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

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
 * Animate
 */
function animate() {
    camera.position.x += Math.abs(mouseX) <= windowHalfX / 2 ? (mouseX / 2 - camera.position.x) * 0.005 : 0;
    camera.position.y += Math.abs(mouseY) <= windowHalfY / 2 ? (-mouseY / 2 - camera.position.y) * 0.005 : 0;
    camera.lookAt(scene.position);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}