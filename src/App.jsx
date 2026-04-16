import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import gsap from 'gsap'
import FloatingIslandScene from './components/FloatingIsland'
import Starfield from './components/Starfield'
import UI from './components/UI'

// GSAP intro + panel camera handler inside Canvas
function SceneController({ isDay, activePanel, onPanelCameraReady }) {
  const { camera } = useThree()
  const controlsRef = useRef()
  const didIntro = useRef(false)

  // Intro fly-in on mount
  useEffect(() => {
    if (didIntro.current) return
    didIntro.current = true
    camera.position.set(0, 2, 22)
    gsap.to(camera.position, {
      x: 6, y: 4, z: 8,
      duration: 2.2, ease: 'power3.out',
    })
  }, [camera])

  // Camera fly when panel opens
  useEffect(() => {
    if (!activePanel) {
      // Fly back to default
      gsap.to(camera.position, { x:6, y:4, z:8, duration:1.2, ease:'power3.inOut' })
      return
    }
    const targets = {
      projects: { pos:[1.5, 2.2, 2.0], look:[0.2, 0.8, -0.5] },
      about:    { pos:[-1.2, 1.8, 3.2], look:[-0.5, 0.5, 1.5] },
      skills:   { pos:[3.5, 2.0, 2.0],  look:[2.2, 0.8, 0.2] },
      contact:  { pos:[-3.2, 2.0, 2.0], look:[-2.0, 0.5, 0.4] },
    }
    const t = targets[activePanel]
    if (!t) return
    gsap.to(camera.position, { x:t.pos[0], y:t.pos[1], z:t.pos[2], duration:1.4, ease:'power3.inOut' })
    gsap.to({}, {
      duration:1.4, ease:'power3.inOut',
      onUpdate() { camera.lookAt(t.look[0], t.look[1], t.look[2]) },
    })
  }, [activePanel, camera])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 22]} fov={45} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={4}
        maxDistance={18}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
        target={[0, 0.5, 0]}
        enabled={!activePanel}
      />

      {/* Lighting */}
      <ambientLight intensity={isDay ? 1.2 : 0.25} color={isDay ? '#ddeeff' : '#1a2040'} />
      <directionalLight
        position={isDay ? [8,12,6] : [4,8,-6]}
        intensity={isDay ? 2.0 : 0.4}
        color={isDay ? '#fff5e0' : '#4060a0'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0,-3,0]} intensity={0.3} color="#3040a0" distance={12} />
    </>
  )
}

export default function App() {
  const [isDay, setIsDay] = useState(false)
  const [activePanel, setActivePanel] = useState(null)

  const handleSelect = (panel) => setActivePanel(panel)
  const handleClose  = (panel) => {
    // If called with a key (from nav), open that panel; else close
    if (typeof panel === 'string') setActivePanel(panel)
    else setActivePanel(null)
  }

  return (
    <div style={{ width:'100vw', height:'100vh', background: isDay ? '#1a3a5c' : '#060d1a' }}>
      <Canvas shadows gl={{ antialias:true, alpha:false }} style={{ width:'100%', height:'100%' }}>
        <SceneController isDay={isDay} activePanel={activePanel} />
        <Starfield count={600} />
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
