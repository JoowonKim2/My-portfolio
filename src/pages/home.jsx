import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scene = new THREE.Scene();
    
    // 우주 느낌의 어두운 배경
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
    camera.position.set(0, 1.5, 6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // 조명 설정
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(3, 5, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // 포인트 라이트 추가 (분위기)
    const pointLight1 = new THREE.PointLight(0xFFB6C1, 0.5, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xADD8E6, 0.5, 10);
    pointLight2.position.set(3, 2, 2);
    scene.add(pointLight2);


    // 파티클 배경 추가 (별처럼)
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

    // 마우스 위치를 저장할 변수
    const mousePosition = { x: 0, y: 0 };
    const targetCameraPosition = { x: 0, y: 1.5 };

    const loader = new GLTFLoader();
    
    // 우주 배경 로드
    loader.load('./models/space/scene.gltf', (gltf) => {
      const spaceModel = gltf.scene;
      
      // 우주 배경 크기 조정 (고양이를 감싸도록)
      spaceModel.scale.set(15, 15, 15);
      spaceModel.position.set(0, 0, 0);
      
      spaceModel.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.BackSide; // 안쪽이 보이도록
        }
      });
      
      scene.add(spaceModel);
    });
    
    // 고양이 모델 로드
    loader.load('./models/oiiaioooooiai_cat/scene.gltf', (gltf) => {
      const model = gltf.scene;

      model.scale.set(1.8, 1.8, 1.8);
      model.position.set(0, 0, 0);

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.DoubleSide;
        }
      });

      scene.add(model);
      clickable.push(model);

      const initialScale = model.scale.clone();

      const handleMouseMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 마우스 위치 저장 (카메라 움직임용)
        mousePosition.x = event.clientX / window.innerWidth - 0.5;
        mousePosition.y = event.clientY / window.innerHeight - 0.5;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickable, true);

        if (intersects.length > 0) {
          gsap.to(model.scale, {
            x: initialScale.x * 1.2,
            y: initialScale.y * 1.2,
            z: initialScale.z * 1.2,
            duration: 0.3,
          });
          document.body.style.cursor = 'pointer';
        } else {
          gsap.to(model.scale, {
            x: initialScale.x,
            y: initialScale.y,
            z: initialScale.z,
            duration: 0.3,
          });
          document.body.style.cursor = 'default';
        }
      };

      const handleClick = () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickable, true);

        if (intersects.length > 0) {
          controls.enabled = false;
          gsap.to(model.scale, {
            x: initialScale.x * 2.2,
            y: initialScale.y * 2.2,
            z: initialScale.z * 2.2,
            duration: 1.2,
            ease: 'power2.inOut',
          });
          gsap.to(camera.position, {
            z: 2.5,
            duration: 1.2,
            ease: 'power2.inOut',
            onComplete: () => navigate('/cat'),
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
        window.removeEventListener('resize', handleResize);
        document.body.style.cursor = 'default';
      };
    });

    const animate = () => {
      requestAnimationFrame(animate);
      
      // 마우스 위치에 따라 카메라 위치 부드럽게 변경
      targetCameraPosition.x = mousePosition.x * 20.0;
      targetCameraPosition.y = 1.5 - mousePosition.y * 20.0;
      
      camera.position.x += (targetCameraPosition.x - camera.position.x) * 0.4;
      camera.position.y += (targetCameraPosition.y - camera.position.y) * 0.4;

      // 카메라가 중앙에서 일정 거리 유지 (최소 거리 설정)
      const distanceFromCenter = Math.sqrt(
        camera.position.x * camera.position.x + 
        camera.position.y * camera.position.y + 
        camera.position.z * camera.position.z
      );
      
      const minDistance = 5; // 최소 거리
      if (distanceFromCenter < minDistance) {
        const scale = minDistance / distanceFromCenter;
        camera.position.x *= scale;
        camera.position.y *= scale;
        camera.position.z *= scale;
      }
      
      // 카메라가 중앙을 계속 바라보도록
      camera.lookAt(0, 0, 0);
      
      // 파티클 회전
      particles.rotation.y += 0.0005;
      
      // 포인트 라이트 애니메이션
      pointLight1.intensity = 0.5 + Math.sin(Date.now() * 0.001) * 0.2;
      pointLight2.intensity = 0.5 + Math.cos(Date.now() * 0.001) * 0.2;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [navigate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block',
        margin: 0,
        padding: 0,
      }}
    />
  );
}

export default Home;