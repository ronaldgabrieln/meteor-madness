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
const geometry = new THREE.SphereGeometry(1.5, 64, 64);

// Create a material using the texture
const material = new THREE.MeshStandardMaterial({ map: earthTexture });

// Create a mesh and add it to the scene
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);
//
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
//
const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05
        });

        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
//
		camera.rotation.z = .2343599997156;
		camera.position.z = 5;

    	let mouseX = 0;
        let mouseY = 0;

        // Seguimiento del mouse
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Raycaster para detectar clicks en la esfera
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Función para crear crater (abollar)
        function crearCrater(worldPoint) {
         
            const localPoint = earth.worldToLocal(worldPoint.clone());

            const positions = geometry.attributes.position;
            const craterRadius = 0.3; // Radio del crater
            const craterDepth = 0.2; // Profundidad del crater

            for (let i = 0; i < positions.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(positions, i);

                // Calcular distancia del vértice al punto de impacto (en espacio local)
                const distance = vertex.distanceTo(localPoint);

                if (distance < craterRadius) {
                    // Calcular factor de deformación (más fuerte en el centro)
                    const factor = 1 - (distance / craterRadius);
                    const deformation = factor * craterDepth;

                    // Mover vértice hacia adentro
                    vertex.normalize();
                    vertex.multiplyScalar(1.5 - deformation);

                    positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
                }
            }

            positions.needsUpdate = true;
            geometry.computeVertexNormals(); // Recalcular normales para iluminación correcta
        }

        // click detect
        document.addEventListener('click', (event) => {
            // Convertir posición del mouse a coords
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Actualizar raycaster // como linea de vision
            raycaster.setFromCamera(mouse, camera);

            // Verificar intersección con la esfera
            const intersects = raycaster.intersectObject(earth);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                crearCrater(intersectionPoint);

                // Feedback visual: cambiar color brevemente
                //material.color.setHex(0xff4444);
                setTimeout(() => {
                    //material.color.setHex(0x4a90e2);
                }, 100);
            }
        });




function animate() {
	renderer.render(scene,camera);
	earth.rotation.y += 0.01;
}
renderer.setAnimationLoop(animate);