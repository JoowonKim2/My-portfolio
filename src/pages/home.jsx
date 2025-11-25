import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scene = new THREE.Scene();
    
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.Fog(0x000510, 15, 30);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 0);

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(3, 5, 5);
    light.castShadow = true;
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const pointLight1 = new THREE.PointLight(0xFFB6C1, 0.5, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xADD8E6, 0.5, 10);
    pointLight2.position.set(3, 2, 2);
    scene.add(pointLight2);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clickable = [];
    const mousePosition = { x: 0, y: 0 };

    const loader = new GLTFLoader();
    
    loader.load('./models/space/scene.gltf', (gltf) => {
      const spaceModel = gltf.scene;
      spaceModel.scale.set(15, 15, 15);
      scene.add(spaceModel);
    });
    
    // 🐱 고양이 모델
    loader.load('./models/oiiaioooooiai_cat/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(1.8, 1.8, 1.8);
      model.position.set(0, 0, -5);
      model.userData.initialScale = model.scale.clone();
      model.userData.type = 'cat';

      scene.add(model);
      clickable.push(model);
    });

    // 🐕 시바견 모델
    loader.load('./models/shiba/scene.gltf', (gltf) => {
      const newModel = gltf.scene;
      newModel.scale.set(1.0, 1.0, 1.0);
      newModel.position.set(3, 1, -8);
      newModel.userData.initialScale = newModel.scale.clone();
      newModel.userData.type = 'shiba';

      scene.add(newModel);
      clickable.push(newModel);
    });

    // hover 확대
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      mousePosition.x = event.clientX / window.innerWidth - 0.5;
      mousePosition.y = event.clientY / window.innerHeight - 0.5;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickable, true);

      clickable.forEach(obj => {
        const initial = obj.userData.initialScale;
        gsap.to(obj.scale, {
          x: initial.x,
          y: initial.y,
          z: initial.z,
          duration: 0.2,
        });
      });

      if (intersects.length > 0) {
        let hoveredModel = intersects[0].object;
        while (hoveredModel.parent && hoveredModel.parent.type !== 'Scene') {
          hoveredModel = hoveredModel.parent;
        }

        const initial = hoveredModel.userData.initialScale;
        gsap.to(hoveredModel.scale, {
          x: initial.x * 1.2,
          y: initial.y * 1.2,
          z: initial.z * 1.2,
          duration: 0.25,
        });

        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    // 클릭 시 — 즉시 navigate만 실행 (애니메이션 없음)
    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickable, true);

      if (intersects.length > 0) {
        let clickedModel = intersects[0].object;
        while (clickedModel.parent && clickedModel.parent.type !== 'Scene') {
          clickedModel = clickedModel.parent;
        }

        const type = clickedModel.userData.type;

        if (type === 'cat') navigate('/cat');
        if (type === 'shiba') navigate('/shiba');
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      camera.rotation.y = -mousePosition.x * Math.PI * 2;
      camera.rotation.x = -mousePosition.y * Math.PI;

      particles.rotation.y += 0.0005;

      pointLight1.intensity = 0.5 + Math.sin(Date.now() * 0.001) * 0.2;
      pointLight2.intensity = 0.5 + Math.cos(Date.now() * 0.001) * 0.2;
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.body.style.cursor = 'default';
    };
  }, [navigate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block',
      }}
    />
  );
}

export default Home;