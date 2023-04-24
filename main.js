import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://threejs.org/examples/jsm/postprocessing/ShaderPass.js';
import { SSAOPass } from 'https://threejs.org/examples/jsm/postprocessing/SSAOPass.js';
import { SMAAPass } from 'https://threejs.org/examples/jsm/postprocessing/SMAAPass.js';
import { SSAOShader } from 'https://threejs.org/examples/jsm/shaders/SSAOShader.js';

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    const ssaoPass = new THREE.SSAOPass(scene, camera);
    ssaoPass.kernelRadius = 16;
    composer.addPass(ssaoPass);

    const smaaPass = new THREE.SMAAPass(window.innerWidth, window.innerHeight);
    composer.addPass(smaaPass);

    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Load environment map
    const envLoader = new THREE.CubeTextureLoader();
    const envMap = envLoader.load([
      'https://threejs.org/examples/textures/cube/pisa/px.png',
      'https://threejs.org/examples/textures/cube/pisa/nx.png',
      'https://threejs.org/examples/textures/cube/pisa/py.png',
      'https://threejs.org/examples/textures/cube/pisa/ny.png',
      'https://threejs.org/examples/textures/cube/pisa/pz.png',
      'https://threejs.org/examples/textures/cube/pisa/nz.png'
    ]);

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0, envMap: envMap });

    const sphere1 = new THREE.Mesh(geometry, material);
    sphere1.position.set(-1.5, 0, -3);
    scene.add(sphere1);

    const sphere2 = new THREE.Mesh(geometry, material);
    sphere2.position.set(1.5, 0, -3);
    scene.add(sphere2);

    const light = new THREE.PointLight(0xffffff, 1, 10);
    light.position.set(0, 2, 2);
    scene.add(light);

    let running = false;

    function animate() {
      if (running) {
        requestAnimationFrame(animate);
      }

      composer.render();
    }

    startButton.addEventListener('click', () => {
      running = true;
      startButton.disabled = true;
      stopButton.disabled = false;
      animate();
    });

    stopButton.addEventListener('click', () => {
      running = false;
      startButton.disabled = false;
      stopButton.disabled = true;
    });
