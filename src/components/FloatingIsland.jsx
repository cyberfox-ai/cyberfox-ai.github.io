import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const ISLAND_COLOR   = '#c8c4d8'
const WALL_COLOR     = '#d8d4e8'
const ACCENT_COLOR   = '#e8e4f0'
const SCREEN_GREEN   = '#00ff88'
const SCREEN_RED     = '#ff3333'
const FIRE_COLOR     = '#ff9900'
const WOOD_COLOR     = '#8b6f47'
const TERMINAL_GREEN = '#39ff14'

export function useCameraFly() {
  const { camera } = useThree()
  const fly = (target, lookAt = [0, 0.5, 0], onComplete) => {
    gsap.to(camera.position, {
      x: target[0], y: target[1], z: target[2],
      duration: 1.4, ease: 'power3.inOut',
      onComplete,
    })
    gsap.to(camera, {
      duration: 1.4, ease: 'power3.inOut',
      onUpdate() { camera.lookAt(lookAt[0], lookAt[1], lookAt[2]) },
    })
  }
  const reset = () => fly([6, 4, 8], [0, 0.5, 0])
  return { fly, reset }
}

function Island() {
  return (
    <group>
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 2.4, 1.0, 32]} />
        <meshStandardMaterial color={ISLAND_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.15, 32]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[2.4, 1.2, 0.8, 32]} />
        <meshStandardMaterial color="#b0accc" roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <cylinderGeometry args={[1.2, 0.5, 0.6, 24]} />
        <meshStandardMaterial color="#a8a4c0" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Building() {
  return (
    <group position={[0.2, 0.3, -0.3]}>
      <mesh position={[0, 0.8, -0.9]} castShadow>
        <boxGeometry args={[2.2, 1.6, 0.1]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[-1.05, 0.8, -0.15]} castShadow>
        <boxGeometry args={[0.1, 1.6, 1.5]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[1.05, 0.8, -0.15]} castShadow>
        <boxGeometry args={[0.1, 1.6, 1.5]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.65, -0.2]} castShadow>
        <boxGeometry args={[2.4, 0.08, 1.5]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, -0.2]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 1.5]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 1.0, -0.84]}>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#e0ddf5" roughness={0.3} />
      </mesh>
    </group>
  )
}

function Desk({ onSelect }) {
  return (
    <group position={[0.2, 0.3, -0.5]} onClick={(e) => { e.stopPropagation(); onSelect('projects') }}>
      <mesh position={[0, 0.65, -0.1]} castShadow>
        <boxGeometry args={[1.6, 0.06, 0.8]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.5} />
      </mesh>
      {[[-0.75, -0.3], [0.75, -0.3], [-0.75, 0.3], [0.75, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.32, z - 0.1]}>
          <boxGeometry args={[0.06, 0.66, 0.06]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0.15, 0.98, -0.38]}>
        <boxGeometry args={[0.7, 0.45, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} />
      </mesh>
      <mesh position={[0.15, 0.98, -0.36]}>
        <boxGeometry args={[0.64, 0.39, 0.02]} />
        <meshStandardMaterial color={SCREEN_GREEN} emissive={SCREEN_GREEN} emissiveIntensity={0.5} roughness={0.1} />
      </mesh>
      {[0.06, 0.0, -0.06].map((dy, i) => (
        <mesh key={i} position={[0.15, 0.98 + dy, -0.35]}>
          <boxGeometry args={[0.4 - i * 0.1, 0.015, 0.01]} />
          <meshStandardMaterial color={TERMINAL_GREEN} emissive={TERMINAL_GREEN} emissiveIntensity={1} />
        </mesh>
      ))}
      <mesh position={[0.15, 0.73, -0.38]}>
        <boxGeometry args={[0.06, 0.14, 0.06]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[-0.5, 0.95, -0.35]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} />
      </mesh>
      <mesh position={[-0.5, 0.95, -0.33]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.44, 0.29, 0.02]} />
        <meshStandardMaterial color={SCREEN_RED} emissive={SCREEN_RED} emissiveIntensity={0.25} roughness={0.1} />
      </mesh>
      <mesh position={[0.1, 0.7, 0.0]}>
        <boxGeometry args={[0.55, 0.03, 0.22]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0.6, 0.72, -0.25]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[0.6, 0.88, -0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[0.6, 1.05, -0.3]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.4} />
      </mesh>
      <pointLight position={[0.6, 1.0, -0.3]} intensity={1.2} color="#ffe8c0" distance={2} decay={2} />
      <mesh position={[0.62, 0.69, -0.05]}>
        <capsuleGeometry args={[0.04, 0.08, 4, 8]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[-0.58, 0.73, 0.05]}>
        <cylinderGeometry args={[0.065, 0.055, 0.1, 12]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.6} />
      </mesh>
    </group>
  )
}

function Chair() {
  return (
    <group position={[0.2, 0.28, 0.3]}>
      <mesh castShadow>
        <boxGeometry args={[0.55, 0.07, 0.55]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, -0.25]}>
        <boxGeometry args={[0.5, 0.6, 0.07]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
        <meshStandardMaterial color={ACCENT_COLOR} />
      </mesh>
      <mesh position={[0, -0.38, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
        <meshStandardMaterial color={ACCENT_COLOR} />
      </mesh>
    </group>
  )
}

function Tree() {
  return (
    <group position={[1.8, 0.3, -1.2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.12, 1.2, 8]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.7, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.04, 0.07, 0.7, 8]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} />
      </mesh>
      {[[0,1.5,0,0.7],[-0.45,1.3,0.2,0.55],[0.35,1.2,-0.2,0.5],[-0.2,1.7,-0.3,0.45],[0.3,1.6,0.3,0.4],[-0.5,1.0,-0.1,0.4],[0.1,1.1,0.4,0.38]].map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]} castShadow>
          <sphereGeometry args={[r,7,5]} />
          <meshStandardMaterial color={ISLAND_COLOR} roughness={1.0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Lantern() {
  return (
    <group position={[-1.5, 0.28, -0.6]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0.22, 0.52, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0.42, 0.5, 0]}>
        <boxGeometry args={[0.18, 0.22, 0.18]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.5} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0.42, 0.5, 0]} intensity={1.5} color="#ffe4a0" distance={3} decay={2} />
    </group>
  )
}

function Campfire() {
  const fireRef = useRef()
  useFrame((state) => {
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.12
      fireRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 7) * 0.08
    }
  })
  return (
    <group position={[-0.1, 0.28, 0.9]}>
      <mesh rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} />
      </mesh>
      <mesh rotation={[0, -0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} />
      </mesh>
      <mesh ref={fireRef} position={[0, 0.18, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color={FIRE_COLOR} emissive={FIRE_COLOR} emissiveIntensity={1.2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.05, 0.18, 8]} />
        <meshStandardMaterial color="#ffee00" emissive="#ffee00" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={2.5} color="#ff8800" distance={4} decay={2} />
    </group>
  )
}

function Mailbox({ onSelect }) {
  return (
    <group position={[-2.0, 0.28, 0.4]} onClick={(e) => { e.stopPropagation(); onSelect('contact') }}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.22, 0.18, 0.3]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.3, 8, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={ACCENT_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <boxGeometry args={[0.06, 0.42, 0.06]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.7} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.6} color="#aaddff" distance={1.5} decay={2} />
    </group>
  )
}

function WelcomeSign({ onSelect }) {
  return (
    <group position={[-0.5, 0.32, 1.5]} rotation={[0, -0.2, 0]} onClick={(e) => { e.stopPropagation(); onSelect('about') }}>
      <mesh>
        <boxGeometry args={[1.0, 0.28, 0.06]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.92, 0.20, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
      </mesh>
      {[-0.04, 0.04].map((dy, i) => (
        <mesh key={i} position={[0, dy, 0.055]}>
          <boxGeometry args={[0.7, 0.025, 0.005]} />
          <meshStandardMaterial color={TERMINAL_GREEN} emissive={TERMINAL_GREEN} emissiveIntensity={1.5} />
        </mesh>
      ))}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={i} position={[x, -0.22, 0]}>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
        </mesh>
      ))}
      <pointLight position={[0, 0.1, 0.3]} intensity={0.4} color={TERMINAL_GREEN} distance={1} decay={2} />
    </group>
  )
}

function ProjectCanvas({ onSelect }) {
  return (
    <group position={[2.2, 0.28, 0.2]} rotation={[0, -0.6, 0]} onClick={(e) => { e.stopPropagation(); onSelect('skills') }}>
      <mesh rotation={[0.3, 0, 0]} position={[0, 0.5, 0.1]}>
        <boxGeometry args={[0.04, 1.0, 0.04]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
      </mesh>
      <mesh rotation={[-0.2, 0, 0]} position={[0, 0.5, -0.1]}>
        <boxGeometry args={[0.04, 0.9, 0.04]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.6, 0.45, 0.04]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.3} />
      </mesh>
      {[0.14, 0.06, -0.02, -0.1].map((dy, i) => (
        <mesh key={i} position={[-0.05 + i * 0.01, 0.75 + dy, 0.03]}>
          <boxGeometry args={[0.3 + i * 0.04, 0.025, 0.01]} />
          <meshStandardMaterial color={TERMINAL_GREEN} emissive={TERMINAL_GREEN} emissiveIntensity={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0.75, 0.2]} intensity={0.5} color={TERMINAL_GREEN} distance={1.2} decay={2} />
    </group>
  )
}

function FloatingIslandScene({ onSelect }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
    }
  })
  return (
    <group ref={groupRef}>
      <Island />
      <Building />
      <Desk onSelect={onSelect} />
      <Chair />
      <Tree />
      <Lantern />
      <Campfire />
      <Mailbox onSelect={onSelect} />
      <WelcomeSign onSelect={onSelect} />
      <ProjectCanvas onSelect={onSelect} />
    </group>
  )
}

export default FloatingIslandScene
