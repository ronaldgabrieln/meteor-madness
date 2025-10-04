import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/2k_earth_daymap.jpg');

// Create a sphere geometry (radius, widthSegments, heightSegments)
const geometry = new THREE.SphereGeometry(1, 64, 64);

// Create a material using the texture
const material = new THREE.MeshStandardMaterial({ map: earthTexture });

// Create a mesh and add it to the scene
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

camera.position.z = 5;

function animate() {
	renderer.render(scene,camera);
	earth.rotation.y += 0.01;
}
renderer.setAnimationLoop(animate);