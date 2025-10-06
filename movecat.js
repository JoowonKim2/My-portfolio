import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

let spotLight = new THREE.SpotLight(0xffffff, 3);
spotLight.position.set(0, 10, 1);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.2;
spotLight.castShadow = true;
scene.add(spotLight);

let light = new THREE.DirectionalLight(0xffffff, 0.4);
scene.add(light);

let loader = new GLTFLoader();
loader.load('./oiiaioooooiai_cat/scene.gltf', function(gltf) {
  gltf.scene.position.y = 0.4;
  scene.add(gltf.scene);
  renderer.render(scene, camera);
  function animate() {
    requestAnimationFrame(animate);

    gltf.scene.rotation.y += (mouseX * Math.PI * 2 - gltf.scene.rotation.y) * 0.05;
    gltf.scene.rotation.x += (mouseY * Math.PI - gltf.scene.rotation.x) * 0.05;
    
    renderer.render(scene, camera);
  }
  animate();
});