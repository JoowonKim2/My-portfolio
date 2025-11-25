// shiba.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton'; // 경로는 프로젝트 구조에 맞게 수정

function Shiba() {
  const canvasRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = (event.clientY / window.innerHeight) * 2 - 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCBCBCB);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6);

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(-2, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(2, 5, 3);
    spotLight.angle = Math.PI / 3;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const loader = new GLTFLoader();
    loader.load('./models/shiba/scene.gltf', (gltf) => {
      const model = gltf.scene;

      // 모델 바운딩 박스로 중심 계산
      const box = new THREE.Box3().setFromObject(model);
      model.position.y -= box.min.y; // 발 위치를 0으로

      // 그룹으로 감싸서 회전 pivot 조정
      const group = new THREE.Group();
      group.add(model);
      group.position.set(0, 1, 0);
      group.scale.set(1.0, 1.0, 1.0);

      scene.add(group);

      // 마우스 기반 회전
      const animate = () => {
        requestAnimationFrame(animate);
        group.rotation.y += (mouseX.current * Math.PI * 2 - group.rotation.y) * 0.05;
        group.rotation.x += (mouseY.current * Math.PI - group.rotation.x) * 0.05;
        renderer.render(scene, camera);
      };
      animate();
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
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
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 25px',
          fontSize: '16px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          opacity: 0.8,
          transition: 'opacity 0.3s',
          zIndex: 9999,
        }}
        onMouseEnter={(e) => (e.target.style.opacity = 1)}
        onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
      >
        Back
      </button>

      <LikeButton pageName="shiba" />
    </>
  );
}

export default Shiba;
