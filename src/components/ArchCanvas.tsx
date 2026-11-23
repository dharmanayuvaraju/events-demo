import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ArchCanvasProps {
  activeColor: string;
}

const ArchRibbonRings: React.FC<{ activeColor: string }> = ({ activeColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const pointerPos = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  const ribbons = useMemo(() => {
    const list: Array<{ curve: THREE.CatmullRomCurve3; width: number; accent: boolean }> = [];

    // Arch 1: Main outer ceremonial curve
    const p1 = [
      new THREE.Vector3(-2.8, -1.8, -0.2),
      new THREE.Vector3(-2.2, 0.4, 0.1),
      new THREE.Vector3(-1.2, 1.6, 0.3),
      new THREE.Vector3(0, 2.0, 0.4),
      new THREE.Vector3(1.2, 1.6, 0.3),
      new THREE.Vector3(2.2, 0.4, 0.1),
      new THREE.Vector3(2.8, -1.8, -0.2),
    ];
    list.push({ curve: new THREE.CatmullRomCurve3(p1), width: 0.05, accent: false });

    // Arch 2: Mid intersecting ribbon curve
    const p2 = [
      new THREE.Vector3(-2.4, -1.8, 0.2),
      new THREE.Vector3(-1.8, 0.6, -0.1),
      new THREE.Vector3(-0.8, 1.8, 0.2),
      new THREE.Vector3(0, 2.15, 0.3),
      new THREE.Vector3(0.8, 1.8, 0.2),
      new THREE.Vector3(1.8, 0.6, -0.1),
      new THREE.Vector3(2.4, -1.8, 0.2),
    ];
    list.push({ curve: new THREE.CatmullRomCurve3(p2), width: 0.035, accent: true });

    // Arch 3: Floating inner accent ribbon
    const p3 = [
      new THREE.Vector3(-2.0, -1.8, 0.4),
      new THREE.Vector3(-1.4, 0.7, 0.3),
      new THREE.Vector3(-0.6, 1.5, 0.1),
      new THREE.Vector3(0, 1.8, 0.2),
      new THREE.Vector3(0.6, 1.5, 0.1),
      new THREE.Vector3(1.4, 0.7, 0.3),
      new THREE.Vector3(2.0, -1.8, 0.4),
    ];
    list.push({ curve: new THREE.CatmullRomCurve3(p3), width: 0.025, accent: false });

    return list;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      pointerPos.current = { x: nx * 0.12, y: -ny * 0.08 };
      invalidate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [invalidate]);

  useEffect(() => {
    invalidate();
  }, [activeColor, invalidate]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    targetRotation.current.x = THREE.MathUtils.damp(
      targetRotation.current.x,
      pointerPos.current.y,
      3,
      delta
    );
    targetRotation.current.y = THREE.MathUtils.damp(
      targetRotation.current.y,
      pointerPos.current.x,
      3,
      delta
    );

    groupRef.current.rotation.x = targetRotation.current.x;
    groupRef.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {ribbons.map((ribbon, idx) => {
        const tubeGeom = new THREE.TubeGeometry(ribbon.curve, 64, ribbon.width, 8, false);
        const matColor = ribbon.accent ? '#FFF8EE' : activeColor;

        return (
          <mesh key={idx} geometry={tubeGeom}>
            <meshStandardMaterial
              color={matColor}
              roughness={0.35}
              metalness={0.2}
              wireframe={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const ArchCanvas: React.FC<ArchCanvasProps> = ({ activeColor }) => {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 4.2], fov: 42 }}
      gl={{
        antialias: true,
        powerPreference: 'low-power',
        alpha: true,
      }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} />
      <Suspense fallback={null}>
        <ArchRibbonRings activeColor={activeColor} />
      </Suspense>
    </Canvas>
  );
};

export default ArchCanvas;
