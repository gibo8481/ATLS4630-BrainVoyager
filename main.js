import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// elements for quiz
const closeQuiz = document.getElementById('close-quiz');
const quizContainer = document.getElementById('quiz-container');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const feedback = document.getElementById('feedback'); 

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // camera
    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1.5, 2); 
    camera.lookAt(0, 1, 0);  // look at the center of the brain

    // orbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 1.5, 0);  // ensure camera orbits around the center of the brain
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;  // min distance for zooming in
    controls.maxDistance = 3;  // max distance for zooming out
    controls.maxPolarAngle = Math.PI / 2;  
    controls.update();

    // ground plane where the brain sits
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x102f88, side: THREE.DoubleSide });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // first spotlight on top and front
    const spotLight1 = new THREE.SpotLight(0xffffff, 5); 
    spotLight1.position.set(0, 3, 2); 
    spotLight1.angle = Math.PI / 4;  
    spotLight1.penumbra = 0.5; 
    spotLight1.castShadow = true;
    spotLight1.shadow.bias = -0.0001;
    scene.add(spotLight1);

    // second spotlight - side spotlight
    const spotLight2 = new THREE.SpotLight(0xffffff, 5);
    spotLight2.position.set(2, 2, 0);  // positioned to the right and slightly above the brain
    spotLight2.angle = Math.PI / 4;  
    spotLight2.penumbra = 0.5;
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // third spotlight - back light
    const spotLight3 = new THREE.SpotLight(0xffffff, 5);
    spotLight3.position.set(-2, 2, -2);  // positioned to the left and behind the brain
    spotLight3.angle = Math.PI / 4;
    spotLight3.penumbra = 0.5;
    spotLight3.castShadow = true;
    scene.add(spotLight3);

    

    // GLTFLoader to load the brain model
    const loader = new GLTFLoader().setPath('public/brain_model/');
    loader.load('brain_model_2.gltf', (gltf) => {
        const brain = gltf.scene;
    
        brain.traverse((child) => {
            if (child.isMesh) {
                if (['Frontal_Lobe', 'Temporal_Lobe', 'Parietal_Lobe', 'Occipital_Lobe'].includes(child.name)) {
                    
                    console.log(`Including ${child.name} for interaction`);
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.visible = true;       
            }
        }
        });
        
        // scale the brain model to make it larger and more visible
        brain.scale.set(4, 4, 4); 
     

        // position the brain so it's centered in the spotlight
        brain.position.set(0, 1.05, 0);  // position the brain at the center of the scene

        scene.add(brain);

        // Render the scene
        function render() {
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }
            renderer.render(scene, camera);
        }

        // handle window resize
        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }
        
     function animate() {
        requestAnimationFrame(animate);
        controls.update();  
        render();
    }

    animate();
       
        document.getElementById('progress-container').style.display = 'none';
    }, (xhr) => {
        console.log(`Loading model: ${xhr.loaded / xhr.total * 100}%`);
    }, (error) => {
        console.error(error);
    }
);
    

    // resize event listener to adjust camera and renderer on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // end scene set up
    // raycaster - interact with objects
    const raycaster = new THREE.Raycaster();
    let hoveredObject = null;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseDown);

    function onMouseMove(event) {
        const coords = new THREE.Vector2(
            (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
            -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
          );
    
        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(coords, camera);
    
        // intersect objects in the scene
        const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
            let intersectedObject = intersects[i].object;
            // console.log(`Intersected object: ${intersectedObject.name}`);
        }
        let brainObject= intersects[0].object;
        // console.log(`Hovered object: ${brainObject.name}`);

        const brainParts = ['Frontal_Lobe', 'Parietal_Lobe', 'Temporal_Lobe', 'Occipital_Lobe'];
        if (brainParts.includes(brainObject.name.trim())) {
            // console.log(`${brainObject.name.trim()} hovered`); // debugging
            
            // divvy up texture for each object to update whatever
            if (!brainObject.material.isUnique) {
                brainObject.material = brainObject.material.clone();  // clone the material
                brainObject.material.isUnique = true;  
            }

            // highlight hovered object
            if (hoveredObject !== brainObject) {
                // Reset the previously hovered object
                if (hoveredObject) {
                    hoveredObject.material.emissive.set(0x000000);
                }

                // Set the new hovered object
                hoveredObject = brainObject;
                hoveredObject.material.emissive.set(Math.random() * 0x555555);  // change emissive color
            }
        }
    } else {
        // if no object is hovered, reset the previous hovered object's highlight
        if (hoveredObject) {
            hoveredObject.material.emissive.set(0x000000);  // remove highlight
            hoveredObject = null;
        }
    }
}

        function onMouseDown() {
            if (hoveredObject) {
                const brainPart = hoveredObject.name.trim();
                console.log(`${brainPart} clicked!`);
                showQuiz(brainPart);
            }
        }
        let correctAnswer = "";
        function showQuiz(brainPart) {
       
        
            quizOptions.innerHTML = ""; 

            if (brainPart === "Frontal_Lobe") {
                quizQuestion.textContent = "What is the primary function of the frontal lobe?";
                quizOptions.innerHTML = `
                    <button onclick="submitAnswer('C')">A) Auditory processing</button>
                    <button onclick="submitAnswer('B')">B) Visual processing</button>
                    <button onclick="submitAnswer('C')">C) Higher cognitive functions</button>
                    <button onclick="submitAnswer('D')">D) Sensory processing</button>
                `;
                correctAnswer = 'C';  // Set the correct answer
            } else if (brainPart === "Temporal_Lobe") {
                quizQuestion.textContent = "What is the primary function of the temporal lobe?";
                quizOptions.innerHTML = `
                    <button onclick="submitAnswer('A')">A) Vision</button>
                    <button onclick="submitAnswer('B')">B) Memory and language comprehension</button>
                    <button onclick="submitAnswer('C')">C) Sensory information processing</button>
                    <button onclick="submitAnswer('D')">D) Motor control</button>
                `;
                correctAnswer = 'B';  // Set the correct answer
            } else if (brainPart === "Parietal_Lobe") {
                quizQuestion.textContent = "What is the primary function of the parietal lobe?";
                quizOptions.innerHTML = `
                    <button onclick="submitAnswer('A')">A) Processing sensory information related to touch</button>
                    <button onclick="submitAnswer('B')">B) Vision</button>
                    <button onclick="submitAnswer('C')">C) Speech production</button>
                    <button onclick="submitAnswer('D')">D) Hearing</button>
                `;
                correctAnswer = 'A';  // Set the correct answer
            } else if (brainPart === "Occipital_Lobe") {
                quizQuestion.textContent = "What is the primary function of the occipital lobe?";
                quizOptions.innerHTML = `
                    <button onclick="submitAnswer('A')">A) Memory formation</button>
                    <button onclick="submitAnswer('B')">B) Motor coordination</button>
                    <button onclick="submitAnswer('C')">C) Visual processing</button>
                    <button onclick="submitAnswer('D')">D) Balance</button>
                `;
                correctAnswer = 'C';  // Set the correct answer
            }
            
            quizContainer.style.display = 'block';  // Show the quiz
        }

        function hideQuiz() {
            quizContainer.style.display = 'none';  // Hide quiz container
        }
    
        // Close quiz when the close button is clicked
        closeQuiz.addEventListener('click', hideQuiz);
    
        // Handle the quiz answer submission
        function submitAnswer(answer) {
            
        if (answer === correctAnswer) {
            feedback.textContent = "Correct! Great job!";
            feedback.style.color = "green"; // Feedback in green for correct answer
        } else {
            feedback.textContent = `Incorrect. The correct answer was ${correctAnswer}.`;
            feedback.style.color = "red";  // Feedback in red for incorrect answer
        }

        // Hide the quiz after a few seconds and clear the feedback
        setTimeout(() => {
            hideQuiz();
            feedback.textContent = "";  // Clear feedback
        }, 3000);  // Delay for 3 seconds before hiding the quiz
        }
    // since using type = module need to have a global scope
    window.hideQuiz = hideQuiz;
    window.submitAnswer = submitAnswer;

}

main();
