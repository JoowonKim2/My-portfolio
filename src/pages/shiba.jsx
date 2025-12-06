import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../pages/LikeButton';
import DownloadButton from '../pages/DownloadButton';

function Shiba() {
  const canvasRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const shibaModelFiles = [
  './models/shiba/scene.gltf',
  './models/shiba/scene.bin',
  './models/shiba/textures/default_baseColor.png',
];

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = (event.clientY / window.innerHeight) * 2 - 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6);

    // 깔끔한 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(3, 5, 2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    scene.add(dirLight);

    // 은은한 바닥 그림자
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const loader = new GLTFLoader();
    loader.load(
      './models/shiba/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.8, 0.8, 0.8);
        model.position.set(0, 1.6, 0);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);
        setIsLoading(false);

        const animate = () => {
          requestAnimationFrame(animate);
          model.rotation.y += (mouseX.current * Math.PI * 0.5 - model.rotation.y) * 0.3;
          model.rotation.x += (mouseY.current * Math.PI * 0.5 - model.rotation.x) * 0.3;
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error('Model loading error:', error);
        setIsLoading(false);
      }
    );

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
      
      {/* 로딩 */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#666',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e0e0e0',
            borderTop: '2px solid #333',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Loading
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Back 버튼 - 미니멀 */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: '#fff',
          color: '#333',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f8f8f8';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#fff';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }}
      >
        ← Back
      </button>

      {/* 타이틀 */}
      <div style={{
        position: 'fixed',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '18px',
        fontWeight: '600',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#333',
        letterSpacing: '-0.5px',
        zIndex: 9999,
      }}>
        3D Dog Model
      </div>

      {/* 인터랙션 가이드 */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#999',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
        zIndex: 1000,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
          <path d="M9 21h6"/>
        </svg>
        Drag to rotate
      </div>

      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 9999,
      }}>
        <LikeButton pageName="shiba" />
      </div>

      <div style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        zIndex: 9999,
      }}>
        <DownloadButton modelName="shiba" modelFiles={shibaModelFiles} />
      </div>
    </>
  );
}

export default Shiba;