import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  island:   '#c8c5d8',
  islandDk: '#b0accc',
  wall:     '#d5d2e5',
  wallDk:   '#c0bdd8',
  accent:   '#e8e5f2',
  wood:     '#8b7355',
  woodDk:   '#6b5535',
  screenBg: '#0d1117',
  screenGrn:'#00ff88',
  termGrn:  '#39ff14',
  fire:     '#ff8800',
  fireYlw:  '#ffdd00',
  keyDk:    '#2a2825',
  keyMd:    '#3d3a36',
}

// ─── useCameraFly hook ────────────────────────────────────────────────────────
export function useCameraFly() {
  const { camera } = useThree()
  const fly = (target, lookAt = [0, 0.5, 0], onComplete) => {
    gsap.to(camera.position, { x: target[0], y: target[1], z: target[2], duration: 1.4, ease: 'power3.inOut', onComplete })
    gsap.to({}, { duration: 1.4, ease: 'power3.inOut', onUpdate() { camera.lookAt(lookAt[0], lookAt[1], lookAt[2]) } })
  }
  const reset = () => fly([6, 4, 8], [0, 0.5, 0])
  return { fly, reset }
}

// ─── Island ───────────────────────────────────────────────────────────────────
function Island() {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <cylinderGeometry args={[3.5, 3.5, 0.18, 48]} />
        <meshStandardMaterial color={C.accent} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.5, 3.1, 0.9, 48]} />
        <meshStandardMaterial color={C.island} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[3.1, 2.5, 0.7, 40]} />
        <meshStandardMaterial color={C.islandDk} roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2.5, 1.6, 0.75, 32]} />
        <meshStandardMaterial color={C.islandDk} roughness={0.9} />
      </mesh>
      <mesh position={[0, -2.05, 0]}>
        <cylinderGeometry args={[1.6, 0.5, 0.7, 24]} />
        <meshStandardMaterial color="#a8a4c0" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ─── Building ─────────────────────────────────────────────────────────────────
function Building() {
  return (
    <group position={[0.1, 0.28, -0.4]}>
      <mesh position={[0, 0.82, -0.95]} castShadow>
        <boxGeometry args={[2.4, 1.7, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      <mesh position={[-1.15, 0.82, -0.2]} castShadow>
        <boxGeometry args={[0.1, 1.7, 1.6]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      <mesh position={[1.15, 0.82, -0.2]} castShadow>
        <boxGeometry args={[0.1, 1.7, 1.6]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.68, -0.2]} castShadow>
        <boxGeometry args={[2.5, 0.1, 1.7]} />
        <meshStandardMaterial color={C.accent} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.06, -0.2]} receiveShadow>
        <boxGeometry args={[2.4, 0.1, 1.65]} />
        <meshStandardMaterial color={C.accent} roughness={0.8} />
      </mesh>
      {/* Window */}
      <mesh position={[-0.62, 1.1, -0.9]}>
        <boxGeometry args={[0.55, 0.52, 0.05]} />
        <meshStandardMaterial color="#e0ddf5" roughness={0.2} />
      </mesh>
      <mesh position={[-0.62, 1.1, -0.875]}>
        <boxGeometry args={[0.52, 0.018, 0.01]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[-0.62, 1.1, -0.875]}>
        <boxGeometry args={[0.018, 0.49, 0.01]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      {/* Shelf */}
      <mesh position={[0.7, 1.45, -0.88]}>
        <boxGeometry args={[0.9, 0.05, 0.2]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
      {/* Radio */}
      <mesh position={[0.72, 1.55, -0.8]}>
        <boxGeometry args={[0.28, 0.16, 0.18]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.72, 1.56, -0.71]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
        <meshStandardMaterial color={C.islandDk} roughness={0.4} />
      </mesh>
      {/* Books */}
      {[0.25, 0.33, 0.41].map((x, i) => (
        <mesh key={i} position={[x, 1.56, -0.83]}>
          <boxGeometry args={[0.055, 0.22, 0.14]} />
          <meshStandardMaterial color={[C.islandDk, C.wall, C.wallDk][i]} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
function Keyboard({ position }) {
  const keys = useMemo(() => {
    const arr = []
    const rows = [14, 13, 12, 11, 10]
    const offsets = [0, 0.022, 0.04, 0.058, 0.02]
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < rows[r]; c++) {
        arr.push({ x: (c - rows[r] / 2 + 0.5) * 0.043 + offsets[r], z: (r - 2) * 0.044 })
      }
    }
    return arr
  }, [])

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.66, 0.018, 0.25]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.4} />
      </mesh>
      {keys.map((k, i) => (
        <mesh key={i} position={[k.x, 0.016, k.z]}>
          <boxGeometry args={[0.034, 0.014, 0.036]} />
          <meshStandardMaterial color={C.keyMd} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Mouse ────────────────────────────────────────────────────────────────────
function Mouse({ position }) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.028, 0.055, 6, 12]} />
        <meshStandardMaterial color={C.wall} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.032, -0.01]}>
        <boxGeometry args={[0.022, 0.003, 0.03]} />
        <meshStandardMaterial color={C.islandDk} roughness={0.5} />
      </mesh>
    </group>
  )
}

// ─── Desk Setup ───────────────────────────────────────────────────────────────
function DeskSetup({ onSelect }) {
  return (
    <group position={[0.15, 0.28, -0.6]} onClick={(e) => { e.stopPropagation(); onSelect('projects') }}>
      {/* Desk top */}
      <mesh position={[0, 0.68, -0.05]} castShadow>
        <boxGeometry args={[1.85, 0.07, 0.88]} />
        <meshStandardMaterial color={C.accent} roughness={0.5} />
      </mesh>
      {/* Desk edge */}
      <mesh position={[0, 0.66, 0.4]}>
        <boxGeometry args={[1.85, 0.04, 0.04]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.5} />
      </mesh>
      {/* Drawer block L */}
      <mesh position={[-0.72, 0.3, -0.05]}>
        <boxGeometry args={[0.38, 0.62, 0.82]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Drawer fronts L */}
      {[0.42, 0.22, 0.02].map((y, i) => (
        <group key={i}>
          <mesh position={[-0.72, y, 0.38]}>
            <boxGeometry args={[0.35, 0.16, 0.04]} />
            <meshStandardMaterial color={C.accent} roughness={0.5} />
          </mesh>
          <mesh position={[-0.72, y, 0.41]}>
            <boxGeometry args={[0.08, 0.028, 0.02]} />
            <meshStandardMaterial color={C.islandDk} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* Drawer block R */}
      <mesh position={[0.72, 0.3, -0.05]}>
        <boxGeometry args={[0.38, 0.62, 0.82]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Legs */}
      {[[-0.88, -0.38], [0.88, -0.38], [-0.88, 0.38], [0.88, 0.38]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.33, z]}>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color={C.wallDk} roughness={0.7} />
        </mesh>
      ))}

      {/* Main monitor - terminal */}
      <group position={[0.2, 0.95, -0.38]}>
        <mesh castShadow>
          <boxGeometry args={[0.76, 0.54, 0.06]} />
          <meshStandardMaterial color={C.wall} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <boxGeometry args={[0.72, 0.5, 0.01]} />
          <meshStandardMaterial color={C.screenBg} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.68, 0.46, 0.001]} />
          <meshStandardMaterial color={C.screenGrn} emissive={C.screenGrn} emissiveIntensity={0.25} roughness={0.1} />
        </mesh>
        {/* Terminal lines */}
        {[0.15, 0.08, 0.01, -0.06, -0.13, -0.19].map((y, i) => (
          <mesh key={i} position={[-0.08 + (i % 2) * 0.02, y, 0.042]}>
            <boxGeometry args={[0.3 - (i % 3) * 0.04, 0.013, 0.001]} />
            <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={1.5} />
          </mesh>
        ))}
        {/* Monitor neck + base */}
        <mesh position={[0, -0.31, 0]}>
          <boxGeometry args={[0.065, 0.12, 0.065]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
        <mesh position={[0, -0.39, 0]}>
          <boxGeometry args={[0.24, 0.03, 0.14]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
        <pointLight position={[0, 0, 0.3]} intensity={0.5} color="#00ff88" distance={1.5} decay={2} />
      </group>

      {/* Secondary monitor - code */}
      <group position={[-0.44, 0.9, -0.34]} rotation={[0, 0.38, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.58, 0.44, 0.06]} />
          <meshStandardMaterial color={C.wall} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <boxGeometry args={[0.54, 0.4, 0.01]} />
          <meshStandardMaterial color={C.screenBg} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.5, 0.36, 0.001]} />
          <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={0.2} roughness={0.1} />
        </mesh>
        {/* Code brackets </> */}
        <mesh position={[-0.08, 0.05, 0.043]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.07, 0.07, 0.001]} />
          <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.08, 0.05, 0.043]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.07, 0.07, 0.001]} />
          <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={2} />
        </mesh>
        {/* Lines */}
        {[0.06, 0.0, -0.06, -0.12].map((y, i) => (
          <mesh key={i} position={[0, y - 0.06, 0.043]}>
            <boxGeometry args={[0.22 + (i % 2) * 0.08, 0.011, 0.001]} />
            <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={0.8} />
          </mesh>
        ))}
        <mesh position={[0, -0.26, 0]}>
          <boxGeometry args={[0.065, 0.1, 0.065]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.13]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
      </group>

      <Keyboard position={[0.1, 0.725, 0.06]} />
      <Mouse position={[0.65, 0.725, 0.0]} />

      {/* Desk lamp */}
      <group position={[0.76, 0.72, -0.28]}>
        <mesh><boxGeometry args={[0.08, 0.08, 0.08]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.016, 0.016, 0.52, 8]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0.06, 0.56, -0.06]} rotation={[0.45, 0, 0]}><cylinderGeometry args={[0.016, 0.016, 0.28, 8]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0.08, 0.72, -0.14]} rotation={[0.8, 0, 0.2]}><coneGeometry args={[0.11, 0.16, 12]} /><meshStandardMaterial color={C.accent} roughness={0.4} /></mesh>
        <pointLight position={[0.1, 0.7, -0.18]} intensity={2.0} color="#ffe8c0" distance={2.5} decay={2} />
      </group>

      {/* Coffee mug */}
      <group position={[0.56, 0.73, -0.24]}>
        <mesh><cylinderGeometry args={[0.045, 0.038, 0.08, 12]} /><meshStandardMaterial color={C.wall} roughness={0.5} /></mesh>
        <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.042, 0.042, 0.002, 12]} /><meshStandardMaterial color="#3a2010" roughness={0.3} /></mesh>
        <mesh position={[0.055, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.022, 0.006, 6, 10, Math.PI]} /><meshStandardMaterial color={C.wall} roughness={0.5} /></mesh>
      </group>
    </group>
  )
}

// ─── Chair ────────────────────────────────────────────────────────────────────
function Chair() {
  return (
    <group position={[0.15, 0.28, 0.44]}>
      {/* Seat */}
      <mesh castShadow><boxGeometry args={[0.58, 0.07, 0.56]} /><meshStandardMaterial color={C.wall} roughness={0.7} /></mesh>
      {/* Back */}
      <mesh position={[0, 0.38, -0.25]} castShadow><boxGeometry args={[0.54, 0.68, 0.07]} /><meshStandardMaterial color={C.wall} roughness={0.7} /></mesh>
      {/* Back top curve */}
      <mesh position={[0, 0.73, -0.25]}><cylinderGeometry args={[0.27, 0.27, 0.07, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color={C.wall} roughness={0.7} /></mesh>
      {/* Armrests */}
      {[-1, 1].map((s, i) => (
        <group key={i}>
          <mesh position={[s * 0.32, 0.25, -0.04]}><boxGeometry args={[0.04, 0.46, 0.06]} /><meshStandardMaterial color={C.accent} roughness={0.5} /></mesh>
          <mesh position={[s * 0.32, 0.47, 0.1]}><boxGeometry args={[0.06, 0.04, 0.32]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        </group>
      ))}
      {/* Cylinder */}
      <mesh position={[0, -0.22, 0]}><cylinderGeometry args={[0.04, 0.04, 0.42, 10]} /><meshStandardMaterial color={C.accent} roughness={0.3} metalness={0.4} /></mesh>
      {/* Star base */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[Math.sin((i / 5) * Math.PI * 2) * 0.26, -0.44, Math.cos((i / 5) * Math.PI * 2) * 0.26]} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.52, 0.04, 0.055]} />
          <meshStandardMaterial color={C.islandDk} roughness={0.5} />
        </mesh>
      ))}
      {/* Wheels */}
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[Math.sin((i / 5) * Math.PI * 2) * 0.5, -0.46, Math.cos((i / 5) * Math.PI * 2) * 0.5]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color={C.keyDk} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Tree with Individual Leaves ──────────────────────────────────────────────
function Tree() {
  const leaves = useMemo(() => {
    const arr = []
    const clusters = [
      [0, 1.62, 0], [-0.38, 1.38, 0.18], [0.36, 1.32, -0.16],
      [-0.16, 1.78, -0.26], [0.26, 1.68, 0.26], [-0.5, 1.12, -0.1],
      [0.1, 1.18, 0.4], [0.48, 1.52, 0.08], [-0.22, 1.52, 0.32],
      [0.08, 1.88, 0.08],
    ]
    clusters.forEach(([bx, by, bz]) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const r = 0.1 + Math.random() * 0.22
        arr.push({
          x: bx + Math.cos(angle) * r + (Math.random() - 0.5) * 0.12,
          y: by + (Math.random() - 0.5) * 0.28,
          z: bz + Math.sin(angle) * r + (Math.random() - 0.5) * 0.12,
          s: 0.75 + Math.random() * 0.55,
        })
      }
    })
    return arr
  }, [])

  return (
    <group position={[2.0, 0.28, -1.3]}>
      <mesh castShadow><cylinderGeometry args={[0.1, 0.15, 1.42, 10]} /><meshStandardMaterial color={C.wood} roughness={0.9} /></mesh>
      <mesh position={[-0.16, 0.82, 0]} rotation={[0, 0, 0.44]} castShadow><cylinderGeometry args={[0.045, 0.08, 0.82, 8]} /><meshStandardMaterial color={C.wood} roughness={0.9} /></mesh>
      <mesh position={[0.2, 0.96, -0.08]} rotation={[0.18, 0, -0.34]} castShadow><cylinderGeometry args={[0.035, 0.065, 0.72, 8]} /><meshStandardMaterial color={C.wood} roughness={0.9} /></mesh>
      <mesh position={[0.08, 0.72, 0.14]} rotation={[0.28, 0.5, 0.28]} castShadow><cylinderGeometry args={[0.03, 0.055, 0.56, 8]} /><meshStandardMaterial color={C.woodDk} roughness={0.9} /></mesh>
      {leaves.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, l.z]} castShadow>
          <sphereGeometry args={[0.12 * l.s, 6, 5]} />
          <meshStandardMaterial color={C.island} roughness={1.0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ─── Lantern ──────────────────────────────────────────────────────────────────
function Lantern() {
  return (
    <group position={[-1.65, 0.28, -0.5]}>
      <mesh castShadow><cylinderGeometry args={[0.038, 0.042, 1.15, 10]} /><meshStandardMaterial color={C.wall} roughness={0.6} /></mesh>
      <mesh position={[0.18, 0.5, 0]} rotation={[0, 0, -0.35]}><cylinderGeometry args={[0.022, 0.022, 0.48, 8]} /><meshStandardMaterial color={C.wall} roughness={0.6} /></mesh>
      <group position={[0.38, 0.46, 0]}>
        <mesh castShadow><boxGeometry args={[0.19, 0.22, 0.19]} /><meshStandardMaterial color={C.accent} roughness={0.4} transparent opacity={0.8} /></mesh>
        <mesh position={[0, 0.14, 0]}><boxGeometry args={[0.21, 0.08, 0.21]} /><meshStandardMaterial color={C.wall} roughness={0.5} /></mesh>
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} position={[Math.sin(i * Math.PI / 2) * 0.1, 0, Math.cos(i * Math.PI / 2) * 0.1]} rotation={[0, i * Math.PI / 2, 0]}>
            <planeGeometry args={[0.17, 0.18]} />
            <meshStandardMaterial color="#ffe0a0" transparent opacity={0.35} emissive="#ffe0a0" emissiveIntensity={0.3} />
          </mesh>
        ))}
        <pointLight intensity={2.2} color="#ffe4a0" distance={3.5} decay={2} />
      </group>
    </group>
  )
}

// ─── Campfire ─────────────────────────────────────────────────────────────────
function Campfire() {
  const fireRef = useRef()
  const innerRef = useRef()
  const emberRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (fireRef.current) { fireRef.current.scale.y = 1 + Math.sin(t * 7.3) * 0.15; fireRef.current.scale.x = 1 + Math.sin(t * 5.8) * 0.09 }
    if (innerRef.current) { innerRef.current.scale.y = 1 + Math.sin(t * 9.1 + 1) * 0.18; innerRef.current.scale.x = 1 + Math.sin(t * 6.7 + 2) * 0.11 }
    if (emberRef.current) emberRef.current.rotation.y = t * 1.5
  })

  return (
    <group position={[0.0, 0.28, 0.95]}>
      <mesh rotation={[0, 0.5, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.42, 8]} /><meshStandardMaterial color={C.wood} roughness={0.95} /></mesh>
      <mesh rotation={[0, -0.5, Math.PI / 2]} castShadow><cylinderGeometry args={[0.055, 0.055, 0.42, 8]} /><meshStandardMaterial color={C.woodDk} roughness={0.95} /></mesh>
      <mesh rotation={[Math.PI / 2, 0.9, 0]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.38, 8]} /><meshStandardMaterial color={C.wood} roughness={0.95} /></mesh>
      <mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.1, 8, 6]} /><meshStandardMaterial color="#1a0800" roughness={0.9} emissive="#ff4400" emissiveIntensity={0.3} /></mesh>
      <mesh ref={fireRef} position={[0, 0.22, 0]}><coneGeometry args={[0.12, 0.38, 8]} /><meshStandardMaterial color={C.fire} emissive={C.fire} emissiveIntensity={1.5} transparent opacity={0.88} roughness={0.1} /></mesh>
      <mesh ref={innerRef} position={[0, 0.24, 0]}><coneGeometry args={[0.065, 0.28, 8]} /><meshStandardMaterial color={C.fireYlw} emissive={C.fireYlw} emissiveIntensity={2.5} transparent opacity={0.9} roughness={0.1} /></mesh>
      <mesh position={[0, 0.38, 0]}><coneGeometry args={[0.025, 0.1, 6]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} transparent opacity={0.7} roughness={0.1} /></mesh>
      <group ref={emberRef}>
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[Math.sin(i * 2.09) * 0.07, 0.08, Math.cos(i * 2.09) * 0.07]}>
            <sphereGeometry args={[0.012, 6, 4]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={3} roughness={0.1} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0.35, 0]} intensity={3.2} color="#ff8800" distance={5} decay={2} />
      <pointLight position={[0, 0.1, 0]} intensity={1.5} color="#ff4400" distance={2} decay={2} />
    </group>
  )
}

// ─── Mailbox ──────────────────────────────────────────────────────────────────
function Mailbox({ onSelect }) {
  return (
    <group position={[-2.2, 0.28, 0.5]} rotation={[0, 0.3, 0]} onClick={(e) => { e.stopPropagation(); onSelect('contact') }}>
      <mesh castShadow><boxGeometry args={[0.065, 0.55, 0.065]} /><meshStandardMaterial color={C.wall} roughness={0.7} /></mesh>
      <mesh position={[0, -0.3, 0]}><boxGeometry args={[0.18, 0.05, 0.18]} /><meshStandardMaterial color={C.wallDk} roughness={0.7} /></mesh>
      <mesh position={[0, 0.42, 0]} castShadow><boxGeometry args={[0.28, 0.2, 0.38]} /><meshStandardMaterial color={C.wall} roughness={0.55} /></mesh>
      <mesh position={[0, 0.53, 0]} rotation={[0, Math.PI / 2, 0]}><cylinderGeometry args={[0.14, 0.14, 0.28, 12, 1, false, 0, Math.PI]} /><meshStandardMaterial color={C.accent} roughness={0.55} /></mesh>
      <mesh position={[0, 0.41, 0.2]}><boxGeometry args={[0.16, 0.025, 0.02]} /><meshStandardMaterial color={C.keyDk} roughness={0.4} /></mesh>
      {/* Flag */}
      <mesh position={[0.16, 0.48, 0.12]}><boxGeometry args={[0.012, 0.16, 0.012]} /><meshStandardMaterial color={C.wall} roughness={0.7} /></mesh>
      <mesh position={[0.22, 0.6, 0.12]}><boxGeometry args={[0.12, 0.08, 0.008]} /><meshStandardMaterial color="#cc3333" emissive="#cc3333" emissiveIntensity={0.3} roughness={0.5} /></mesh>
      <pointLight position={[0, 0.5, 0.3]} intensity={0.5} color="#aaddff" distance={1.5} decay={2} />
    </group>
  )
}

// ─── Social Key Tiles ─────────────────────────────────────────────────────────
function KeyTile({ position, url, children }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (url) window.open(url, '_blank')
  }
  return (
    <group position={position} onClick={handleClick}>
      <mesh castShadow>
        <boxGeometry args={[0.28, 0.055, 0.28]} />
        <meshStandardMaterial color={C.keyMd} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.033, 0]}>
        <boxGeometry args={[0.23, 0.018, 0.23]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.3} />
      </mesh>
      {children}
    </group>
  )
}

function SocialKeys() {
  const gh = 'https://github.com/sudovivek'
  const tw = 'https://x.com/sudovivek'
  const li = 'https://linkedin.com/in/sudovivek'
  const ig = 'https://instagram.com/sudovivek'
  const md = 'https://medium.com/sudovivek'

  return (
    <group position={[0.15, 0.31, 0.62]}>
      {/* GitHub key */}
      <KeyTile position={[-0.62, 0, -0.42]} url={gh}>
        <group position={[0, 0.05, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.064, 0.016, 8, 20]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.8} roughness={0.1} /></mesh>
          <mesh position={[-0.04, 0.036, 0]} rotation={[Math.PI / 2, 0, 0.5]}><coneGeometry args={[0.018, 0.04, 4]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.8} roughness={0.1} /></mesh>
          <mesh position={[0.04, 0.036, 0]} rotation={[Math.PI / 2, 0, -0.5]}><coneGeometry args={[0.018, 0.04, 4]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.8} roughness={0.1} /></mesh>
        </group>
      </KeyTile>

      {/* X key */}
      <KeyTile position={[-0.28, 0, -0.42]} url={tw}>
        <group position={[0, 0.051, 0]}>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}><boxGeometry args={[0.155, 0.001, 0.022]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.2} roughness={0.1} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, -Math.PI / 4]}><boxGeometry args={[0.155, 0.001, 0.022]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.2} roughness={0.1} /></mesh>
        </group>
      </KeyTile>

      {/* LinkedIn key */}
      <KeyTile position={[-0.1, 0, 0.12]} url={li}>
        <group position={[0, 0.051, 0]}>
          <mesh position={[-0.045, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><boxGeometry args={[0.02, 0.001, 0.1]} /><meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={1.8} roughness={0.1} /></mesh>
          <mesh position={[-0.045, 0.042, 0]} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[0.016, 6, 6]} /><meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={1.8} roughness={0.1} /></mesh>
          <mesh position={[0.022, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><boxGeometry args={[0.02, 0.001, 0.1]} /><meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={1.8} roughness={0.1} /></mesh>
          <mesh position={[0.045, 0, 0]} rotation={[Math.PI / 2, 0, 0.25]}><boxGeometry args={[0.018, 0.001, 0.075]} /><meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={1.8} roughness={0.1} /></mesh>
        </group>
      </KeyTile>

      {/* Instagram key */}
      <KeyTile position={[0.26, 0, 0.16]} url={ig}>
        <group position={[0, 0.051, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.055, 0.015, 8, 16]} /><meshStandardMaterial color="#e1306c" emissive="#e1306c" emissiveIntensity={1.4} roughness={0.1} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.028, 0.012, 8, 16]} /><meshStandardMaterial color="#e1306c" emissive="#e1306c" emissiveIntensity={1.4} roughness={0.1} /></mesh>
          <mesh position={[0.042, 0.042, 0]}><sphereGeometry args={[0.012, 6, 6]} /><meshStandardMaterial color="#e1306c" emissive="#e1306c" emissiveIntensity={1.8} roughness={0.1} /></mesh>
        </group>
      </KeyTile>

      {/* Medium key */}
      <KeyTile position={[0.55, 0, 0.04]} url={md}>
        <group position={[0, 0.051, 0]}>
          <mesh position={[-0.058, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.026, 0.026, 0.001, 16]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.0} roughness={0.1} /></mesh>
          <mesh position={[0.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.018, 0.018, 0.001, 16]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.0} roughness={0.1} /></mesh>
          <mesh position={[0.05, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.012, 0.001, 16]} /><meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.0} roughness={0.1} /></mesh>
        </group>
      </KeyTile>
    </group>
  )
}

// ─── Welcome Sign ─────────────────────────────────────────────────────────────
function WelcomeSign({ onSelect }) {
  return (
    <group position={[-0.45, 0.32, 1.6]} rotation={[0, -0.2, 0]} onClick={(e) => { e.stopPropagation(); onSelect('about') }}>
      <mesh castShadow><boxGeometry args={[1.1, 0.32, 0.072]} /><meshStandardMaterial color={C.wood} roughness={0.75} /></mesh>
      <mesh position={[0, 0, 0.038]}><boxGeometry args={[1.0, 0.22, 0.01]} /><meshStandardMaterial color={C.keyDk} roughness={0.3} /></mesh>
      {[0.058, 0.0, -0.058].map((dy, i) => (
        <mesh key={i} position={[0, dy, 0.048]}>
          <boxGeometry args={[0.72 - i * 0.06, 0.022, 0.005]} />
          <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={1.8} roughness={0.1} />
        </mesh>
      ))}
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={i} position={[x, -0.26, 0]}><boxGeometry args={[0.065, 0.25, 0.065]} /><meshStandardMaterial color={C.woodDk} roughness={0.8} /></mesh>
      ))}
      <pointLight position={[0, 0.1, 0.35]} intensity={0.5} color={C.termGrn} distance={1.2} decay={2} />
    </group>
  )
}

// ─── Art Canvas ───────────────────────────────────────────────────────────────
function ProjectCanvas({ onSelect }) {
  return (
    <group position={[2.3, 0.28, 0.3]} rotation={[0, -0.55, 0]} onClick={(e) => { e.stopPropagation(); onSelect('skills') }}>
      {/* Easel legs */}
      <mesh position={[-0.12, 0.6, -0.08]} rotation={[0.15, 0, 0.08]} castShadow><cylinderGeometry args={[0.022, 0.022, 1.3, 8]} /><meshStandardMaterial color={C.wood} roughness={0.8} /></mesh>
      <mesh position={[0.12, 0.6, -0.08]} rotation={[0.15, 0, -0.08]} castShadow><cylinderGeometry args={[0.022, 0.022, 1.3, 8]} /><meshStandardMaterial color={C.wood} roughness={0.8} /></mesh>
      <mesh position={[0, 0.55, 0.15]} rotation={[-0.22, 0, 0]} castShadow><cylinderGeometry args={[0.018, 0.018, 1.1, 8]} /><meshStandardMaterial color={C.woodDk} roughness={0.8} /></mesh>
      {/* Canvas */}
      <mesh position={[0, 0.9, 0]}><boxGeometry args={[0.72, 0.54, 0.05]} /><meshStandardMaterial color={C.wall} roughness={0.4} /></mesh>
      <mesh position={[0, 0.9, 0.03]}><boxGeometry args={[0.65, 0.47, 0.01]} /><meshStandardMaterial color="#0a1a0a" roughness={0.2} /></mesh>
      {/* React orbits */}
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[0, 0.96, 0.04]} rotation={[Math.PI / 2, 0, (i / 3) * Math.PI]}>
          <torusGeometry args={[0.082, 0.015, 8, 24]} />
          <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, 0.96, 0.046]}><sphereGeometry args={[0.022, 8, 6]} /><meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={2} roughness={0.1} /></mesh>
      {/* Text */}
      {[0.76, 0.70, 0.64].map((y, i) => (
        <mesh key={i} position={[0, y, 0.04]}>
          <boxGeometry args={[0.26 - i * 0.03, 0.018, 0.002]} />
          <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
      ))}
      {/* Palette */}
      <mesh position={[-0.08, 0.22, 0.04]}><cylinderGeometry args={[0.1, 0.1, 0.02, 12]} /><meshStandardMaterial color={C.accent} roughness={0.5} /></mesh>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[Math.sin(i * 1.57) * 0.065 - 0.08, 0.24, Math.cos(i * 1.57) * 0.065 + 0.04]}>
          <sphereGeometry args={[0.018, 6, 5]} />
          <meshStandardMaterial color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][i]} roughness={0.3} />
        </mesh>
      ))}
      <pointLight position={[0, 0.9, 0.25]} intensity={0.6} color="#61dafb" distance={1.4} decay={2} />
    </group>
  )
}

// ─── Small Plants ─────────────────────────────────────────────────────────────
function SmallPlant({ position }) {
  return (
    <group position={position}>
      <mesh castShadow><cylinderGeometry args={[0.065, 0.075, 0.09, 10]} /><meshStandardMaterial color="#d4722a" roughness={0.8} /></mesh>
      <mesh position={[0, 0.048, 0]}><cylinderGeometry args={[0.062, 0.062, 0.01, 10]} /><meshStandardMaterial color="#4a3020" roughness={1} /></mesh>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[Math.sin(i * 2.09) * 0.065, 0.14 + i * 0.02, Math.cos(i * 2.09) * 0.065]}>
          <sphereGeometry args={[0.075, 6, 5]} />
          <meshStandardMaterial color={C.island} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ─── Rocks ────────────────────────────────────────────────────────────────────
function Rocks() {
  const positions = [[-2.5, 0.28, -1.1, 0.12], [2.8, 0.28, 0.8, 0.09], [-1.8, 0.28, 1.8, 0.08], [2.2, 0.28, -2.0, 0.07], [-0.5, 0.28, 2.8, 0.1]]
  return (
    <group>
      {positions.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 6, 5]} />
          <meshStandardMaterial color={C.islandDk} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────
function Steps() {
  return (
    <group position={[0.15, 0.25, 0.55]}>
      <mesh position={[0, 0, -0.1]}><boxGeometry args={[1.6, 0.06, 0.55]} /><meshStandardMaterial color={C.accent} roughness={0.8} /></mesh>
      <mesh position={[0, -0.06, 0.2]}><boxGeometry args={[1.6, 0.06, 0.55]} /><meshStandardMaterial color={C.wallDk} roughness={0.8} /></mesh>
    </group>
  )
}

// ─── Full Scene ───────────────────────────────────────────────────────────────
function FloatingIslandScene({ onSelect }) {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating ONLY - no auto-rotation
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <Island />
      <Building />
      <Steps />
      <DeskSetup onSelect={onSelect} />
      <Chair />
      <Tree />
      <Lantern />
      <Campfire />
      <Mailbox onSelect={onSelect} />
      <WelcomeSign onSelect={onSelect} />
      <ProjectCanvas onSelect={onSelect} />
      <SocialKeys />
      <SmallPlant position={[-2.4, 0.28, -1.8]} />
      <SmallPlant position={[2.6, 0.28, -0.6]} />
      <Rocks />
    </group>
  )
}

export default FloatingIslandScene
