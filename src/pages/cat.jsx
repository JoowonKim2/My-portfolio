import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useNavigate } from 'react-router-dom';

function Cat() {
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
    loader.load('./models/oiiaioooooiai_cat/scene.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(1.8, 1.8, 1.8);
      model.position.set(0, 1, 0);

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.side = THREE.DoubleSide;
        }
      });

      scene.add(model);

      // 마우스 움직임 기반 회전
      const animate = () => {
        requestAnimationFrame(animate);
        model.rotation.y += (mouseX.current * Math.PI * 2 - model.rotation.y) * 0.05;
        model.rotation.x += (mouseY.current * Math.PI - model.rotation.x) * 0.05;
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
    </>
  );
}

export default Cat;