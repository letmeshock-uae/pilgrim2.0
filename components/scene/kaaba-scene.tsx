'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { usePilgrimStore } from '@/lib/store/pilgrim-store'
import locations from '@/data/locations.json'

// Kaaba cube
function Kaaba({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Main Kaaba box */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[1.2, 1.5, 1.2]} />
        <meshStandardMaterial
          color={hovered ? '#2a2a2a' : '#1a1a1a'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Gold band (Kiswah border) */}
      <mesh rotation={[0, 0, 0]} position={[0, 0.3, 0]}>
        <boxGeometry args={[1.22, 0.08, 1.22]} />
        <meshStandardMaterial color="#B8962E" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Floor platform */}
      <mesh position={[0, -0.76, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.04, 32]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Location hotspot
function LocationHotspot({
  position,
  label,
  onClick,
}: {
  position: [number, number, number]
  label: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? '#D4AF37' : '#B8962E'}
        emissive={hovered ? '#B8962E' : '#6B5000'}
        emissiveIntensity={0.5}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  )
}

// Tawaf ring
function TawafRing() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.73, 0]}>
      <ringGeometry args={[1.8, 2.0, 64]} />
      <meshStandardMaterial
        color="#B8962E"
        transparent
        opacity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Camera controller
function CameraController() {
  const { cameraTarget } = usePilgrimStore()
  const { camera } = useThree()

  useFrame(() => {
    camera.lookAt(
      cameraTarget[0] * 0.1,
      cameraTarget[1] * 0.1,
      cameraTarget[2] * 0.1
    )
  })

  return null
}

export function KaabaScene({ onLocationSelect }: { onLocationSelect: (id: string) => void }) {
  const { setSelectedLocation, setCameraTarget } = usePilgrimStore()

  const handleLocationClick = (id: string, position: number[]) => {
    setSelectedLocation(id)
    setCameraTarget(position as [number, number, number])
    onLocationSelect(id)
  }

  return (
    <div className="w-full h-full bg-[#F9F9F9]">
      <Canvas
        camera={{ position: [3, 2.5, 3], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#F9F9F9' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-3, 3, -3]} intensity={0.4} color="#FFF5E0" />

          {/* Stars background */}
          <Stars radius={50} depth={30} count={800} factor={3} fade />

          {/* Tawaf ring */}
          <TawafRing />

          {/* Main Kaaba */}
          <Float speed={0.5} rotationIntensity={0} floatIntensity={0.2}>
            <Kaaba onClick={() => handleLocationClick('kaaba', [0, 0, 0])} />
          </Float>

          {/* Location hotspots */}
          {locations.slice(1).map((loc) => (
            <LocationHotspot
              key={loc.id}
              position={[
                loc.position[0] * 0.5,
                loc.position[1] + 0.2,
                loc.position[2] * 0.5,
              ]}
              label={loc.name}
              onClick={() => handleLocationClick(loc.id, loc.position)}
            />
          ))}

          {/* Orbit controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />

          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}
