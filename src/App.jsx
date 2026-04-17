import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import FloatingIslandScene from './components/FloatingIsland'
import Starfield from './components/Starfield'
import UI from './components/UI'

// Camera targets for each panel — fly to zoom near the relevant 3D object
const CAM_TARGETS = {
  about:   { pos: [0.8,  2.0, 2.2],  look: [0.18, 1.0, -0.4]  }, // zoom to main monitor
  resume:  { pos: [-2.2, 2.0, 2.4],  look: [-0.55, 1.1, -0.86] }, // zoom to window
  blog:    { pos: [3.2,  2.0, 2.0],  look: [2.25, 0.82, 0.22]  }, // zoom to easel
  contact: { pos: [-3.8, 2.0, 2.0],  look: [-2.05, 0.5, 0.45]  }, // zoom to mailbox
  social:  { pos: [0.8,  1.6, 3.0],  look: [0.68, 0.2, 1.75]   }, // zoom to social pads
}

function SceneController({ isDay, activePanel }) {
  const { camera } = useThree()
  const didIntro = useRef(false)

  useEffect(() => {
    if (didIntro.current) return
    didIntro.current = true
    camera.position.set(0, 2, 22)
    gsap.to(camera.position, { x: 6, y: 4, z: 8, duration: 2.5, ease: 'power3.out' })
  }, [camera])

  useEffect(() => {
    if (!activePanel) {
      gsap.to(camera.position, { x: 6, y: 4, z: 8, duration: 1.2, ease: 'power3.inOut' })
      return
    }
    const t = CAM_TARGETS[activePanel]
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
        target={[0, 0.3, 0]}
        enabled={!activePanel}
        enableDamping
        dampingFactor={0.06}
      />

      {/* ── Lighting ── */}
      {isDay ? (
        <>
          <ambientLight intensity={1.4} color="#e8f0ff" />
          <directionalLight
            position={[8, 14, 6]} intensity={2.2} color="#fff8e0"
            castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
            shadow-camera-left={-8} shadow-camera-right={8}
            shadow-camera-top={8} shadow-camera-bottom={-8}
          />
          <hemisphereLight intensity={0.5} color="#ddeeff" groundColor="#ccc8dc" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.18} color="#1a2040" />
          <directionalLight position={[4, 10, -6]} intensity={0.35} color="#4060a0"
            castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <directionalLight position={[-8, 6, 4]} intensity={0.22} color="#8aabdc" />
          <pointLight position={[0, 1, 0]} intensity={0.4} color="#ff8820" distance={8} decay={2} />
          <hemisphereLight intensity={0.12} color="#1a2860" groundColor="#0d0d1a" />
        </>
      )}
      <pointLight position={[0, -3, 0]} intensity={0.2} color="#3040a0" distance={12} />
    </>
  )
}

export default function App() {
  const [isDay, setIsDay] = useState(false)
  const [activePanel, setActivePanel] = useState(null)

  const handleSelect = panel => setActivePanel(panel)
  const handleClose  = panel => {
    if (typeof panel === 'string') setActivePanel(panel)
    else setActivePanel(null)
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: isDay
        ? 'radial-gradient(ellipse at 50% 20%, #2a5a8c 0%, #1a3a5c 60%, #0d1e30 100%)'
        : 'radial-gradient(ellipse at 50% 30%, #0e1628 0%, #060d1a 55%, #020508 100%)',
      overflow: 'hidden',
    }}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, toneMapping: 3, toneMappingExposure: isDay ? 1.1 : 0.9 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneController isDay={isDay} activePanel={activePanel} />
        {!isDay && <Starfield count={700} />}
        <FloatingIslandScene onSelect={handleSelect} />
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
