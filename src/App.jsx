import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei'
import gsap from 'gsap'
import FloatingIslandScene from './components/FloatingIsland'
import Starfield from './components/Starfield'
import UI from './components/UI'

function SceneController({ isDay, activePanel }) {
  const { camera } = useThree()
  const didIntro = useRef(false)

  useEffect(() => {
    if (didIntro.current) return
    didIntro.current = true
    camera.position.set(0, 2, 22)
    gsap.to(camera.position, {
      x: 6, y: 4, z: 8,
      duration: 2.2, ease: 'power3.out',
    })
  }, [camera])

  useEffect(() => {
    if (!activePanel) {
      gsap.to(camera.position, { x: 6, y: 4, z: 8, duration: 1.2, ease: 'power3.inOut' })
      return
    }
    const targets = {
      projects: { pos: [1.5, 2.2, 2.0],  look: [0.2, 0.8, -0.5] },
      about:    { pos: [-1.2, 1.8, 3.2], look: [-0.5, 0.5, 1.5] },
      skills:   { pos: [3.5, 2.0, 2.0],  look: [2.2, 0.8, 0.2] },
      contact:  { pos: [-3.2, 2.0, 2.0], look: [-2.0, 0.5, 0.4] },
    }
    const t = targets[activePanel]
    if (!t) return
    gsap.to(camera.position, { x: t.pos[0], y: t.pos[1], z: t.pos[2], duration: 1.4, ease: 'power3.inOut' })
    gsap.to({}, {
      duration: 1.4, ease: 'power3.inOut',
      onUpdate() { camera.lookAt(t.look[0], t.look[1], t.look[2]) },
    })
  }, [activePanel, camera])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 22]} fov={42} />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={18}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate={false}
        target={[0, 0.5, 0]}
        enabled={!activePanel}
        enableDamping
        dampingFactor={0.06}
      />

      {/* Ambient */}
      <ambientLight intensity={isDay ? 1.0 : 0.18} color={isDay ? '#ddeeff' : '#1a2040'} />

      {/* Key light */}
      <directionalLight
        position={isDay ? [8, 12, 6] : [4, 8, -6]}
        intensity={isDay ? 2.2 : 0.5}
        color={isDay ? '#fff5e0' : '#4060a0'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />

      {/* Fill from opposite side */}
      <directionalLight
        position={isDay ? [-6, 4, -4] : [-4, 3, 6]}
        intensity={isDay ? 0.4 : 0.15}
        color={isDay ? '#c0d8ff' : '#2040a0'}
      />

      {/* Under-island glow */}
      <pointLight position={[0, -3.5, 0]} intensity={0.4} color="#3040a0" distance={12} />

      {/* Rim light for atmosphere */}
      <pointLight position={[0, 5, -5]} intensity={isDay ? 0.3 : 0.6} color={isDay ? '#ffffff' : '#204080'} distance={15} />
    </>
  )
}

export default function App() {
  const [isDay, setIsDay] = useState(false)
  const [activePanel, setActivePanel] = useState(null)

  const handleSelect = (panel) => setActivePanel(panel)
  const handleClose = (panel) => {
    if (typeof panel === 'string') setActivePanel(panel)
    else setActivePanel(null)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: isDay ? '#0d2540' : '#04080f' }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, toneMapping: 3, toneMappingExposure: 1.1 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneController isDay={isDay} activePanel={activePanel} />
        <Starfield count={800} />
        <FloatingIslandScene onSelect={handleSelect} />
        {/* Subtle fog for depth */}
        <fog attach="fog" args={[isDay ? '#0d2540' : '#04080f', 18, 45]} />
      </Canvas>
      <UI
        isDay={isDay}
        onToggleDay={() => setIsDay(d => !d)}
        activePanel={activePanel}
        onClosePanel={handleClose}
      />
    </div>
  )
}
