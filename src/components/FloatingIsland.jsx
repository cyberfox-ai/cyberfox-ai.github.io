import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ── Palette: warm clay + dark wood like reference image ───────────────────
const C = {
  island:    '#d8d5e8',
  islandTop: '#eae7f5',
  islandBot: '#b8b5cc',
  wall:      '#dddae8',
  wallDk:    '#c8c4d8',
  accent:    '#eceaf5',
  wood:      '#8b6f3a',
  woodDk:    '#6b4f2a',
  roof:      '#4a5878',   // blue-grey roof like reference
  roofDk:    '#363d55',
  screenBg:  '#0d1117',
  kaliBlue:  '#1a2a4a',   // Kali Linux wallpaper base
  kaliDragon:'#2244aa',
  termGrn:   '#39ff14',
  fire:      '#ff8800',
  fireYlw:   '#ffdd00',
  keyDk:     '#1a1a2a',
  keyMd:     '#2d2d3d',
  social:    '#c8c4d8',
  socDk:     '#a8a4c0',
}

// ── Camera fly hook ────────────────────────────────────────────────────────
export function useCameraFly() {
  const { camera } = useThree()
  const fly = (target, lookAt = [0, 0.5, 0], onComplete) => {
    gsap.to(camera.position, { x: target[0], y: target[1], z: target[2], duration: 1.4, ease: 'power3.inOut', onComplete })
    gsap.to({}, { duration: 1.4, ease: 'power3.inOut', onUpdate() { camera.lookAt(lookAt[0], lookAt[1], lookAt[2]) } })
  }
  return { fly, reset: () => fly([6, 4, 8], [0, 0.5, 0]) }
}

// ── Island base ────────────────────────────────────────────────────────────
function Island() {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.2, 56]} />
        <meshStandardMaterial color={C.islandTop} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.6, 3.2, 0.9, 48]} />
        <meshStandardMaterial color={C.island} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[3.2, 2.6, 0.7, 40]} />
        <meshStandardMaterial color={C.islandBot} roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2.6, 1.5, 0.75, 32]} />
        <meshStandardMaterial color={C.islandBot} roughness={0.9} />
      </mesh>
      <mesh position={[0, -2.05, 0]}>
        <cylinderGeometry args={[1.5, 0.4, 0.7, 24]} />
        <meshStandardMaterial color="#a8a4c0" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ── Open-roof house (like reference: 3 walls + open front) ─────────────────
function House() {
  return (
    <group position={[0.1, 0.27, -0.5]}>
      {/* Floor */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.5, 0.08, 1.9]} />
        <meshStandardMaterial color={C.accent} roughness={0.75} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.95, -0.9]} castShadow>
        <boxGeometry args={[2.5, 1.9, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-1.2, 0.95, -0.05]} castShadow>
        <boxGeometry args={[0.1, 1.9, 1.8]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.7} />
      </mesh>

      {/* Right wall */}
      <mesh position={[1.2, 0.95, -0.05]} castShadow>
        <boxGeometry args={[0.1, 1.9, 1.8]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.7} />
      </mesh>

      {/* Ceiling / roof base plate */}
      <mesh position={[0, 1.92, -0.05]} castShadow>
        <boxGeometry args={[2.5, 0.1, 1.9]} />
        <meshStandardMaterial color={C.roof} roughness={0.6} />
      </mesh>

      {/* Roof overhang front */}
      <mesh position={[0, 1.93, 0.98]}>
        <boxGeometry args={[2.6, 0.08, 0.28]} />
        <meshStandardMaterial color={C.roofDk} roughness={0.6} />
      </mesh>
      {/* Roof overhang back */}
      <mesh position={[0, 1.93, -1.0]}>
        <boxGeometry args={[2.6, 0.08, 0.2]} />
        <meshStandardMaterial color={C.roofDk} roughness={0.6} />
      </mesh>
      {/* Roof side overhangs */}
      <mesh position={[-1.28, 1.93, -0.05]}>
        <boxGeometry args={[0.18, 0.08, 2.1]} />
        <meshStandardMaterial color={C.roofDk} roughness={0.6} />
      </mesh>
      <mesh position={[1.28, 1.93, -0.05]}>
        <boxGeometry args={[0.18, 0.08, 2.1]} />
        <meshStandardMaterial color={C.roofDk} roughness={0.6} />
      </mesh>

      {/* Back wall window left */}
      <mesh position={[-0.68, 1.1, -0.85]}>
        <boxGeometry args={[0.52, 0.48, 0.06]} />
        <meshStandardMaterial color="#c8e0f8" roughness={0.1} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.68, 1.1, -0.82]}>
        <boxGeometry args={[0.015, 0.48, 0.01]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      <mesh position={[-0.68, 1.1, -0.82]}>
        <boxGeometry args={[0.52, 0.015, 0.01]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>
      {/* Window sill */}
      <mesh position={[-0.68, 0.84, -0.88]}>
        <boxGeometry args={[0.6, 0.05, 0.12]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>

      {/* Right shelf on back wall */}
      <mesh position={[0.72, 1.55, -0.84]}>
        <boxGeometry args={[0.88, 0.055, 0.2]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
      {/* Radio on shelf */}
      <mesh position={[0.72, 1.65, -0.76]}>
        <boxGeometry args={[0.26, 0.15, 0.18]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.72, 1.66, -0.68]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 14]} />
        <meshStandardMaterial color={C.socDk} roughness={0.4} />
      </mesh>
      {/* Books */}
      {[0.3, 0.38, 0.46].map((x, i) => (
        <mesh key={i} position={[x, 1.66, -0.8]}>
          <boxGeometry args={[0.055, 0.2, 0.14]} />
          <meshStandardMaterial color={[C.socDk, C.wall, C.wallDk][i]} roughness={0.6} />
        </mesh>
      ))}

      {/* Interior warm light */}
      <pointLight position={[0, 1.2, -0.1]} intensity={2.0} color="#ffe8c0" distance={3.5} decay={2} />
    </group>
  )
}

// ── Keyboard with individual keycaps ──────────────────────────────────────
function Keyboard({ position }) {
  const keys = useMemo(() => {
    const arr = []
    const rows = [14, 13, 12, 11, 10]
    const offsets = [0, 0.02, 0.038, 0.055, 0.018]
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
        <boxGeometry args={[0.68, 0.02, 0.26]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.35} />
      </mesh>
      {keys.map((k, i) => (
        <mesh key={i} position={[k.x, 0.018, k.z]}>
          <boxGeometry args={[0.035, 0.015, 0.037]} />
          <meshStandardMaterial color={C.keyMd} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// ── Mouse ─────────────────────────────────────────────────────────────────
function Mouse({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.028, 0.058, 6, 12]} />
        <meshStandardMaterial color={C.wall} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.033, -0.01]}>
        <boxGeometry args={[0.02, 0.003, 0.028]} />
        <meshStandardMaterial color={C.socDk} roughness={0.5} />
      </mesh>
    </group>
  )
}

// ── Kali Linux wallpaper texture (procedural) ─────────────────────────────
function KaliScreen({ width = 0.68, height = 0.5, position = [0,0,0.04] }) {
  return (
    <group position={position}>
      {/* Dark blue base - Kali wallpaper */}
      <mesh>
        <boxGeometry args={[width, height, 0.002]} />
        <meshStandardMaterial color={C.kaliBlue} roughness={0.05} />
      </mesh>
      {/* Dragon body - center large shape */}
      <mesh position={[0, 0.02, 0.003]}>
        <boxGeometry args={[width * 0.28, height * 0.62, 0.001]} />
        <meshStandardMaterial color={C.kaliDragon} emissive={C.kaliDragon} emissiveIntensity={0.4} roughness={0.1} />
      </mesh>
      {/* Dragon wings left */}
      <mesh position={[-width*0.18, 0.04, 0.003]} rotation={[0,0,0.3]}>
        <boxGeometry args={[width * 0.22, height * 0.38, 0.001]} />
        <meshStandardMaterial color="#1a3a88" emissive="#1a3a88" emissiveIntensity={0.3} roughness={0.1} />
      </mesh>
      {/* Dragon wings right */}
      <mesh position={[width*0.18, 0.04, 0.003]} rotation={[0,0,-0.3]}>
        <boxGeometry args={[width * 0.22, height * 0.38, 0.001]} />
        <meshStandardMaterial color="#1a3a88" emissive="#1a3a88" emissiveIntensity={0.3} roughness={0.1} />
      </mesh>
      {/* Kali text bar */}
      <mesh position={[0, -height*0.35, 0.003]}>
        <boxGeometry args={[width * 0.55, height * 0.1, 0.001]} />
        <meshStandardMaterial color="#2255cc" emissive="#2255cc" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      {/* "KALI LINUX" label dots */}
      {[-0.12,-0.06,0,0.06,0.12].map((x,i) => (
        <mesh key={i} position={[x, -height*0.35, 0.004]}>
          <boxGeometry args={[0.018, 0.014, 0.001]} />
          <meshStandardMaterial color="#88aaff" emissive="#88aaff" emissiveIntensity={1.5} roughness={0.1} />
        </mesh>
      ))}
      {/* Glow */}
      <pointLight position={[0, 0, 0.1]} intensity={0.4} color="#2244aa" distance={1.2} decay={2} />
    </group>
  )
}

// ── Desk Setup ─────────────────────────────────────────────────────────────
function DeskSetup({ onSelect }) {
  return (
    <group position={[0.1, 0.27, -0.6]} onClick={(e) => { e.stopPropagation(); onSelect('projects') }}>
      {/* Desk surface */}
      <mesh position={[0, 0.69, -0.05]} castShadow>
        <boxGeometry args={[1.95, 0.07, 0.9]} />
        <meshStandardMaterial color={C.accent} roughness={0.5} />
      </mesh>
      {/* Desk edge strip */}
      <mesh position={[0, 0.67, 0.42]}>
        <boxGeometry args={[1.95, 0.04, 0.04]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.5} />
      </mesh>
      {/* Left drawer block */}
      <mesh position={[-0.76, 0.32, -0.05]}>
        <boxGeometry args={[0.4, 0.62, 0.84]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {[0.44, 0.24, 0.04].map((y, i) => (
        <group key={i}>
          <mesh position={[-0.76, y, 0.4]}>
            <boxGeometry args={[0.36, 0.17, 0.04]} />
            <meshStandardMaterial color={C.accent} roughness={0.5} />
          </mesh>
          <mesh position={[-0.76, y, 0.425]}>
            <boxGeometry args={[0.09, 0.03, 0.02]} />
            <meshStandardMaterial color={C.socDk} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* Right drawer block */}
      <mesh position={[0.76, 0.32, -0.05]}>
        <boxGeometry args={[0.4, 0.62, 0.84]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Legs */}
      {[[-0.9,-0.4],[0.9,-0.4],[-0.9,0.4],[0.9,0.4]].map(([x,z],i) => (
        <mesh key={i} position={[x, 0.34, z]}>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color={C.wallDk} roughness={0.7} />
        </mesh>
      ))}

      {/* ── Main monitor: Kali Linux ── */}
      <group position={[0.22, 0.98, -0.42]}>
        {/* Bezel */}
        <mesh castShadow>
          <boxGeometry args={[0.78, 0.56, 0.065]} />
          <meshStandardMaterial color={C.wall} roughness={0.5} />
        </mesh>
        {/* Screen bg */}
        <mesh position={[0, 0, 0.034]}>
          <boxGeometry args={[0.74, 0.52, 0.01]} />
          <meshStandardMaterial color={C.screenBg} roughness={0.05} />
        </mesh>
        {/* Kali wallpaper */}
        <KaliScreen width={0.7} height={0.48} position={[0, 0, 0.042]} />
        {/* Stand */}
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.07, 0.14, 0.07]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.26, 0.03, 0.15]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
      </group>

      {/* ── Side monitor: terminal green ── */}
      <group position={[-0.48, 0.93, -0.37]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.46, 0.065]} />
          <meshStandardMaterial color={C.wall} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.034]}>
          <boxGeometry args={[0.56, 0.42, 0.01]} />
          <meshStandardMaterial color={C.screenBg} roughness={0.05} />
        </mesh>
        {/* Terminal screen */}
        <mesh position={[0, 0, 0.042]}>
          <boxGeometry args={[0.52, 0.38, 0.002]} />
          <meshStandardMaterial color="#001a00" roughness={0.1} />
        </mesh>
        {/* Terminal text lines */}
        {[0.12, 0.06, 0.0, -0.06, -0.12, -0.17].map((y, i) => (
          <mesh key={i} position={[-0.06 + (i%2)*0.04, y, 0.045]}>
            <boxGeometry args={[0.28 - (i%3)*0.04, 0.014, 0.001]} />
            <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={1.6} roughness={0.1} />
          </mesh>
        ))}
        {/* Cursor blink block */}
        <mesh position={[-0.15, -0.17, 0.045]}>
          <boxGeometry args={[0.025, 0.018, 0.001]} />
          <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <boxGeometry args={[0.07, 0.12, 0.07]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.24, 0.03, 0.14]} />
          <meshStandardMaterial color={C.wallDk} />
        </mesh>
        <pointLight position={[0, 0, 0.25]} intensity={0.45} color="#00ff88" distance={1.4} decay={2} />
      </group>

      <Keyboard position={[0.12, 0.735, 0.07]} />
      <Mouse position={[0.68, 0.732, 0.02]} />

      {/* Desk lamp */}
      <group position={[0.78, 0.73, -0.3]}>
        <mesh><boxGeometry args={[0.09,0.09,0.09]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0,0.3,0]}><cylinderGeometry args={[0.016,0.016,0.54,8]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0.06,0.58,-0.06]} rotation={[0.45,0,0]}><cylinderGeometry args={[0.015,0.015,0.26,8]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0.08,0.74,-0.16]} rotation={[0.8,0,0.2]}><coneGeometry args={[0.12,0.17,12]} /><meshStandardMaterial color={C.accent} roughness={0.4} /></mesh>
        <pointLight position={[0.1,0.72,-0.2]} intensity={2.2} color="#ffe8c0" distance={2.6} decay={2} />
      </group>

      {/* Coffee mug */}
      <group position={[0.58,0.74,-0.26]}>
        <mesh><cylinderGeometry args={[0.046,0.039,0.082,14]} /><meshStandardMaterial color={C.wall} roughness={0.5} /></mesh>
        <mesh position={[0,0.04,0]}><cylinderGeometry args={[0.043,0.043,0.002,14]} /><meshStandardMaterial color="#3a2010" roughness={0.3} /></mesh>
        <mesh position={[0.056,0.01,0]} rotation={[0,0,Math.PI/2]}><torusGeometry args={[0.022,0.006,6,10,Math.PI]} /><meshStandardMaterial color={C.wall} roughness={0.5} /></mesh>
      </group>

      {/* Notepad */}
      <mesh position={[-0.55, 0.735, 0.12]}>
        <boxGeometry args={[0.26, 0.01, 0.2]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.7} />
      </mesh>
      {[0.06, 0.02, -0.02, -0.06].map((dz, i) => (
        <mesh key={i} position={[-0.55, 0.742, 0.12 + dz]}>
          <boxGeometry args={[0.2, 0.002, 0.008]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ── Realistic Tree with flat leaf shapes ──────────────────────────────────
function Leaf({ position, rotation, scale = 1 }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      {/* Elongated teardrop leaf shape using scaled sphere */}
      <sphereGeometry args={[0.1 * scale, 6, 4]} />
      <meshStandardMaterial color={C.island} roughness={1.0} flatShading />
    </mesh>
  )
}

function TreeBranch({ start, end, radius }) {
  const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start))
  const len = dir.length()
  const mid = new THREE.Vector3(...start).add(dir.clone().multiplyScalar(0.5))
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().normalize())
  const euler = new THREE.Euler().setFromQuaternion(quat)
  return (
    <mesh position={[mid.x, mid.y, mid.z]} rotation={[euler.x, euler.y, euler.z]} castShadow>
      <cylinderGeometry args={[radius * 0.6, radius, len, 7]} />
      <meshStandardMaterial color={C.wood} roughness={0.9} />
    </mesh>
  )
}

function Tree({ position = [2.0, 0.28, -1.3] }) {
  // Leaf data: [x, y, z, scaleX, scaleY, scaleZ, rotX, rotY, rotZ]
  const leafData = useMemo(() => {
    const arr = []
    const clusters = [
      // main crown
      [0, 1.9, 0],     [-0.45, 1.65, 0.2],   [0.4, 1.6, -0.2],
      [-0.2, 2.1, -0.3],[0.3, 2.0, 0.3],     [-0.55, 1.35, -0.1],
      [0.15, 1.4, 0.45],[0.52, 1.75, 0.1],   [-0.25, 1.8, 0.38],
      [0.1, 2.28, 0.08],[-0.38, 2.2, 0.18],  [0.38, 2.22, -0.14],
    ]
    clusters.forEach(([bx, by, bz]) => {
      // Each cluster: 5 leaves radiating out at different angles
      for (let i = 0; i < 7; i++) {
        const az = (i / 7) * Math.PI * 2
        const el = (Math.random() - 0.3) * 0.8
        const r = 0.12 + Math.random() * 0.2
        arr.push({
          x: bx + Math.cos(az) * r,
          y: by + Math.sin(el) * 0.18 + (Math.random() - 0.5) * 0.12,
          z: bz + Math.sin(az) * r,
          // elongated leaf: scale non-uniformly
          sx: (0.7 + Math.random() * 0.6),
          sy: (1.4 + Math.random() * 0.8),
          sz: (0.35 + Math.random() * 0.3),
          rx: Math.random() * Math.PI,
          ry: az + Math.random() * 0.5,
          rz: (Math.random() - 0.5) * 0.6,
        })
      }
    })
    return arr
  }, [])

  return (
    <group position={position}>
      {/* Root flares */}
      {[0,1,2,3].map(i => (
        <mesh key={i} position={[Math.cos(i*Math.PI/2)*0.14, -0.04, Math.sin(i*Math.PI/2)*0.14]} rotation={[0, i*Math.PI/2, 0.32]}>
          <boxGeometry args={[0.07, 0.2, 0.18]} />
          <meshStandardMaterial color={C.woodDk} roughness={0.9} />
        </mesh>
      ))}
      {/* Main trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1.55, 9]} />
        <meshStandardMaterial color={C.wood} roughness={0.92} />
      </mesh>
      {/* Branches */}
      <TreeBranch start={[-0.06, 0.78, 0.04]} end={[-0.38, 1.45, 0.18]} radius={0.065} />
      <TreeBranch start={[0.06, 0.92, -0.04]} end={[0.35, 1.52, -0.18]} radius={0.055} />
      <TreeBranch start={[0.0, 1.05, 0.06]} end={[0.1, 1.55, 0.42]} radius={0.048} />
      <TreeBranch start={[0.0, 0.85, 0.0]} end={[0.0, 1.65, 0.04]} radius={0.07} />

      {/* Individual elongated leaves */}
      {leafData.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, l.z]} rotation={[l.rx, l.ry, l.rz]} castShadow>
          <sphereGeometry args={[0.095, 5, 4]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? C.island : i % 3 === 1 ? C.islandTop : C.islandBot}
            roughness={1.0}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

// ── Lantern ────────────────────────────────────────────────────────────────
function Lantern({ position = [-1.7, 0.28, -0.5] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.038, 0.044, 1.18, 10]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      <mesh position={[0.18, 0.5, 0]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.022, 0.022, 0.5, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      <group position={[0.4, 0.46, 0]}>
        {/* Glass panels */}
        {[0,1,2,3].map(i => (
          <mesh key={i} position={[Math.sin(i*Math.PI/2)*0.105, 0, Math.cos(i*Math.PI/2)*0.105]} rotation={[0, i*Math.PI/2, 0]}>
            <planeGeometry args={[0.19, 0.22]} />
            <meshStandardMaterial color="#ffe0a0" transparent opacity={0.3} emissive="#ffe0a0" emissiveIntensity={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* Frame */}
        <mesh><boxGeometry args={[0.21, 0.26, 0.21]} /><meshStandardMaterial color={C.accent} roughness={0.4} transparent opacity={0.15} /></mesh>
        {/* Top cap */}
        <mesh position={[0, 0.16, 0]}><boxGeometry args={[0.23, 0.06, 0.23]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        <mesh position={[0, 0.22, 0]}><coneGeometry args={[0.13, 0.1, 4]} /><meshStandardMaterial color={C.wallDk} roughness={0.5} /></mesh>
        {/* Bulb */}
        <mesh position={[0, -0.02, 0]}><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#ffe8a0" emissive="#ffe8a0" emissiveIntensity={1.8} roughness={0.1} /></mesh>
        <pointLight intensity={2.4} color="#ffe4a0" distance={3.8} decay={2} />
      </group>
    </group>
  )
}

// ── Campfire ───────────────────────────────────────────────────────────────
function Campfire({ position = [0.0, 0.28, 0.95] }) {
  const fireRef = useRef()
  const innerRef = useRef()
  const emberRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (fireRef.current) { fireRef.current.scale.y = 1 + Math.sin(t*7.3)*0.15; fireRef.current.scale.x = 1 + Math.sin(t*5.8)*0.09 }
    if (innerRef.current) { innerRef.current.scale.y = 1 + Math.sin(t*9.1+1)*0.18; innerRef.current.scale.x = 1 + Math.sin(t*6.7+2)*0.11 }
    if (emberRef.current) emberRef.current.rotation.y = t * 1.5
  })
  return (
    <group position={position}>
      {/* Stone ring */}
      {[0,1,2,3,4,5].map(i => (
        <mesh key={i} position={[Math.cos(i/6*Math.PI*2)*0.2, 0.02, Math.sin(i/6*Math.PI*2)*0.2]}>
          <sphereGeometry args={[0.07, 6, 5]} />
          <meshStandardMaterial color={C.socDk} roughness={0.95} flatShading />
        </mesh>
      ))}
      <mesh rotation={[0,0.5,Math.PI/2]} castShadow><cylinderGeometry args={[0.055,0.055,0.42,8]} /><meshStandardMaterial color={C.wood} roughness={0.95} /></mesh>
      <mesh rotation={[0,-0.5,Math.PI/2]} castShadow><cylinderGeometry args={[0.055,0.055,0.42,8]} /><meshStandardMaterial color={C.woodDk} roughness={0.95} /></mesh>
      <mesh rotation={[Math.PI/2,0.9,0]} castShadow><cylinderGeometry args={[0.045,0.045,0.38,8]} /><meshStandardMaterial color={C.wood} roughness={0.95} /></mesh>
      <mesh position={[0,0.03,0]}><sphereGeometry args={[0.1,8,6]} /><meshStandardMaterial color="#1a0800" roughness={0.9} emissive="#ff4400" emissiveIntensity={0.3} /></mesh>
      <mesh ref={fireRef} position={[0,0.22,0]}><coneGeometry args={[0.12,0.38,8]} /><meshStandardMaterial color={C.fire} emissive={C.fire} emissiveIntensity={1.5} transparent opacity={0.88} roughness={0.1} /></mesh>
      <mesh ref={innerRef} position={[0,0.24,0]}><coneGeometry args={[0.065,0.28,8]} /><meshStandardMaterial color={C.fireYlw} emissive={C.fireYlw} emissiveIntensity={2.5} transparent opacity={0.9} roughness={0.1} /></mesh>
      <mesh position={[0,0.38,0]}><coneGeometry args={[0.025,0.1,6]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} transparent opacity={0.7} roughness={0.1} /></mesh>
      <group ref={emberRef}>
        {[0,1,2].map(i => (
          <mesh key={i} position={[Math.sin(i*2.09)*0.07, 0.08, Math.cos(i*2.09)*0.07]}>
            <sphereGeometry args={[0.012,6,4]} />
            <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={3} roughness={0.1} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0,0.35,0]} intensity={3.2} color="#ff8800" distance={5} decay={2} />
      <pointLight position={[0,0.1,0]} intensity={1.5} color="#ff4400" distance={2} decay={2} />
    </group>
  )
}

// ── Improved Mailbox ───────────────────────────────────────────────────────
function Mailbox({ onSelect }) {
  return (
    <group position={[-2.2, 0.28, 0.5]} rotation={[0, 0.3, 0]} onClick={(e) => { e.stopPropagation(); onSelect('contact') }}>
      {/* Post with base */}
      <mesh position={[0, -0.26, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.22]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.7} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.068, 0.56, 0.068]} />
        <meshStandardMaterial color={C.wall} roughness={0.65} />
      </mesh>
      {/* Box body */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.3, 0.22, 0.42]} />
        <meshStandardMaterial color="#d0d0e8" roughness={0.5} />
      </mesh>
      {/* Rounded roof */}
      <mesh position={[0, 0.565, 0]} rotation={[0, Math.PI/2, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.42, 14, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#b8b8d0" roughness={0.5} />
      </mesh>
      {/* Back plate */}
      <mesh position={[0, 0.44, -0.22]}>
        <boxGeometry args={[0.3, 0.22, 0.02]} />
        <meshStandardMaterial color="#b8b8d0" roughness={0.5} />
      </mesh>
      {/* Mail slot */}
      <mesh position={[0, 0.44, 0.22]}>
        <boxGeometry args={[0.16, 0.035, 0.025]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.4} />
      </mesh>
      {/* Door hinge dots */}
      {[-0.09, 0.09].map((y, i) => (
        <mesh key={i} position={[-0.14, 0.44+y, 0.22]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color={C.socDk} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      {/* Flag pole */}
      <mesh position={[0.16, 0.52, 0.1]}>
        <boxGeometry args={[0.012, 0.2, 0.012]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.22, 0.65, 0.1]}>
        <boxGeometry args={[0.14, 0.09, 0.006]} />
        <meshStandardMaterial color="#cc3333" emissive="#cc3333" emissiveIntensity={0.4} roughness={0.5} />
      </mesh>
      {/* Address numbers */}
      <mesh position={[0, 0.44, 0.225]}>
        <boxGeometry args={[0.08, 0.024, 0.002]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.3} />
      </mesh>
      <pointLight position={[0, 0.6, 0.4]} intensity={0.55} color="#aaddff" distance={1.6} decay={2} />
    </group>
  )
}

// ── Social Media Badge Icons on floor ─────────────────────────────────────
// Square badge tiles with raised 3D logo shapes — fully visible on floor
function SocialBadge({ position, color, glowColor, symbol, url, onSelect }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (url) window.open(url, '_blank')
    else onSelect && onSelect('contact')
  }

  return (
    <group position={position} onClick={handleClick}>
      {/* Badge base - rounded square */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.055, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Top face slightly inset */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.26, 0.016, 0.26]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.25} />
      </mesh>
      {/* Corner radius indicators */}
      {[[-0.12,0.12],[-0.12,-0.12],[0.12,0.12],[0.12,-0.12]].map(([x,z],i) => (
        <mesh key={i} position={[x, 0.0, z]}>
          <sphereGeometry args={[0.016, 5, 5]} />
          <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
      ))}

      {/* ── Icon geometry raised on top ── */}
      {symbol === 'github' && (
        <group position={[0, 0.048, 0]}>
          {/* Octocat head circle */}
          <mesh rotation={[Math.PI/2,0,0]}>
            <torusGeometry args={[0.066, 0.016, 8, 20]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.9} roughness={0.1} />
          </mesh>
          {/* Octocat ears */}
          <mesh position={[-0.038, 0.044, 0]} rotation={[Math.PI/2,0,0]}>
            <coneGeometry args={[0.018, 0.035, 4]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.038, 0.044, 0]} rotation={[Math.PI/2,0,0]}>
            <coneGeometry args={[0.018, 0.035, 4]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.9} roughness={0.1} />
          </mesh>
          {/* Tentacle tail */}
          <mesh position={[0, -0.072, 0]} rotation={[Math.PI/2,0,0]}>
            <boxGeometry args={[0.016, 0.001, 0.045]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}

      {symbol === 'x' && (
        <group position={[0, 0.049, 0]}>
          <mesh rotation={[Math.PI/2, 0, Math.PI/4]}>
            <boxGeometry args={[0.16, 0.001, 0.026]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.4} roughness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, -Math.PI/4]}>
            <boxGeometry args={[0.16, 0.001, 0.026]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.4} roughness={0.1} />
          </mesh>
        </group>
      )}

      {symbol === 'linkedin' && (
        <group position={[0, 0.049, 0]}>
          {/* "in" - left vertical bar */}
          <mesh position={[-0.05, 0, 0]} rotation={[Math.PI/2,0,0]}>
            <boxGeometry args={[0.022, 0.001, 0.1]} />
            <meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={2} roughness={0.1} />
          </mesh>
          {/* dot above left bar */}
          <mesh position={[-0.05, 0.05, 0]} rotation={[Math.PI/2,0,0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.001, 8]} />
            <meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={2} roughness={0.1} />
          </mesh>
          {/* right vertical bar */}
          <mesh position={[0.02, -0.01, 0]} rotation={[Math.PI/2,0,0]}>
            <boxGeometry args={[0.022, 0.001, 0.1]} />
            <meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={2} roughness={0.1} />
          </mesh>
          {/* curve on right */}
          <mesh position={[0.052, 0.016, 0]} rotation={[Math.PI/2,0,0]}>
            <torusGeometry args={[0.03, 0.012, 6, 10, Math.PI]} />
            <meshStandardMaterial color="#0a66c2" emissive="#0a66c2" emissiveIntensity={2} roughness={0.1} />
          </mesh>
        </group>
      )}

      {symbol === 'instagram' && (
        <group position={[0, 0.049, 0]}>
          {/* Outer rounded square */}
          <mesh rotation={[Math.PI/2,0,0]}>
            <torusGeometry args={[0.072, 0.016, 4, 4]} />
            <meshStandardMaterial color="#e1306c" emissive="#e1306c" emissiveIntensity={1.5} roughness={0.1} />
          </mesh>
          {/* Inner circle */}
          <mesh rotation={[Math.PI/2,0,0]}>
            <torusGeometry args={[0.036, 0.013, 8, 16]} />
            <meshStandardMaterial color="#e1306c" emissive="#e1306c" emissiveIntensity={1.5} roughness={0.1} />
          </mesh>
          {/* Corner dot */}
          <mesh position={[0.05, 0.05, 0]}>
            <sphereGeometry args={[0.014, 6, 6]} />
            <meshStandardMaterial color="#e1306c" emissive="#e1306c" emissiveIntensity={2} roughness={0.1} />
          </mesh>
        </group>
      )}

      {symbol === 'medium' && (
        <group position={[0, 0.049, 0]}>
          <mesh position={[-0.055, 0, 0]} rotation={[Math.PI/2,0,0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.001, 16]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.2} roughness={0.1} />
          </mesh>
          <mesh position={[0.005, 0, 0]} rotation={[Math.PI/2,0,0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.001, 16]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.2} roughness={0.1} />
          </mesh>
          <mesh position={[0.054, 0, 0]} rotation={[Math.PI/2,0,0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.001, 16]} />
            <meshStandardMaterial color={C.accent} emissive={C.accent} emissiveIntensity={1.2} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Glow pool under badge */}
      <pointLight position={[0, -0.06, 0]} intensity={0.4} color={glowColor} distance={0.65} decay={2} />
    </group>
  )
}

function SocialBadges({ onSelect }) {
  return (
    <group position={[0, 0.31, 0]}>
      {/* Spread badges clearly on the empty floor area in front of house */}
      <SocialBadge position={[-0.7, 0, 0.55]}  color="#2d2d3d" glowColor="#ffffff" symbol="github"    url="https://github.com"    onSelect={onSelect} />
      <SocialBadge position={[0.0,  0, 0.88]}  color="#1a1a2a" glowColor="#cccccc" symbol="x"         url="https://x.com"         onSelect={onSelect} />
      <SocialBadge position={[0.72, 0, 0.58]}  color="#0a1a3a" glowColor="#0a66c2" symbol="linkedin"  url="https://linkedin.com"  onSelect={onSelect} />
      <SocialBadge position={[-0.7, 0, 1.08]}  color="#2a1020" glowColor="#e1306c" symbol="instagram" url="https://instagram.com" onSelect={onSelect} />
      <SocialBadge position={[0.72, 0, 1.08]}  color="#1a1a1a" glowColor="#ffffff" symbol="medium"    url="https://medium.com"    onSelect={onSelect} />
    </group>
  )
}

// ── Welcome Sign ───────────────────────────────────────────────────────────
function WelcomeSign({ onSelect }) {
  return (
    <group position={[-0.4, 0.32, 1.72]} rotation={[0, -0.18, 0]} onClick={(e) => { e.stopPropagation(); onSelect('about') }}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.32, 0.072]} />
        <meshStandardMaterial color={C.wood} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.038]}>
        <boxGeometry args={[1.02, 0.23, 0.01]} />
        <meshStandardMaterial color={C.keyDk} roughness={0.3} />
      </mesh>
      {[0.06, 0.0, -0.06].map((dy, i) => (
        <mesh key={i} position={[0, dy, 0.048]}>
          <boxGeometry args={[0.74 - i*0.06, 0.022, 0.005]} />
          <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={1.8} roughness={0.1} />
        </mesh>
      ))}
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={i} position={[x, -0.26, 0]}>
          <boxGeometry args={[0.065, 0.25, 0.065]} />
          <meshStandardMaterial color={C.woodDk} roughness={0.8} />
        </mesh>
      ))}
      <pointLight position={[0, 0.1, 0.35]} intensity={0.5} color={C.termGrn} distance={1.2} decay={2} />
    </group>
  )
}

// ── Skills Easel ───────────────────────────────────────────────────────────
function ProjectCanvas({ onSelect }) {
  return (
    <group position={[2.3, 0.28, 0.3]} rotation={[0, -0.55, 0]} onClick={(e) => { e.stopPropagation(); onSelect('skills') }}>
      <mesh position={[-0.12, 0.62, -0.08]} rotation={[0.15,0,0.08]} castShadow><cylinderGeometry args={[0.022,0.022,1.32,8]} /><meshStandardMaterial color={C.wood} roughness={0.8} /></mesh>
      <mesh position={[0.12, 0.62, -0.08]} rotation={[0.15,0,-0.08]} castShadow><cylinderGeometry args={[0.022,0.022,1.32,8]} /><meshStandardMaterial color={C.wood} roughness={0.8} /></mesh>
      <mesh position={[0, 0.56, 0.15]} rotation={[-0.22,0,0]} castShadow><cylinderGeometry args={[0.018,0.018,1.12,8]} /><meshStandardMaterial color={C.woodDk} roughness={0.8} /></mesh>
      <mesh position={[0, 0.92, 0]}><boxGeometry args={[0.74, 0.56, 0.052]} /><meshStandardMaterial color={C.wall} roughness={0.4} /></mesh>
      <mesh position={[0, 0.92, 0.028]}><boxGeometry args={[0.67, 0.49, 0.01]} /><meshStandardMaterial color="#0a1a0a" roughness={0.2} /></mesh>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[0, 0.97, 0.036]} rotation={[Math.PI/2, 0, (i/3)*Math.PI]}>
          <torusGeometry args={[0.083, 0.015, 8, 24]} />
          <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, 0.97, 0.044]}><sphereGeometry args={[0.022, 8, 6]} /><meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={2} roughness={0.1} /></mesh>
      {[0.78, 0.72, 0.66].map((y, i) => (
        <mesh key={i} position={[0, y, 0.037]}>
          <boxGeometry args={[0.26-i*0.03, 0.018, 0.002]} />
          <meshStandardMaterial color={C.termGrn} emissive={C.termGrn} emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
      ))}
      <pointLight position={[0, 0.92, 0.25]} intensity={0.6} color="#61dafb" distance={1.4} decay={2} />
    </group>
  )
}

// ── Small potted plants ────────────────────────────────────────────────────
function SmallPlant({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.065, 0.075, 0.09, 10]} />
        <meshStandardMaterial color="#c07040" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.048, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.01, 10]} />
        <meshStandardMaterial color="#4a3020" roughness={1} />
      </mesh>
      {[0,1,2].map(i => (
        <mesh key={i} position={[Math.sin(i*2.09)*0.065, 0.14+i*0.02, Math.cos(i*2.09)*0.065]}>
          <sphereGeometry args={[0.075, 6, 5]} />
          <meshStandardMaterial color={C.island} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ── Rocks ─────────────────────────────────────────────────────────────────
function Rocks() {
  return (
    <group>
      {[[-2.6,0.28,-1.1,0.12],[ 2.9,0.28, 0.8,0.09],[-1.8,0.28, 1.8,0.08],
        [ 2.2,0.28,-2.0,0.07],[-0.5,0.28, 2.9,0.1],[ 2.8,0.28,-1.5,0.07]].map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]} castShadow>
          <sphereGeometry args={[r,6,5]} />
          <meshStandardMaterial color={C.islandBot} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────
function Steps() {
  return (
    <group position={[0.1, 0.25, 0.42]}>
      <mesh position={[0, 0, -0.08]}><boxGeometry args={[1.6, 0.06, 0.52]} /><meshStandardMaterial color={C.accent} roughness={0.8} /></mesh>
      <mesh position={[0, -0.06, 0.22]}><boxGeometry args={[1.6, 0.06, 0.52]} /><meshStandardMaterial color={C.wallDk} roughness={0.8} /></mesh>
    </group>
  )
}

// ── Main Scene ─────────────────────────────────────────────────────────────
function FloatingIslandScene({ onSelect }) {
  const groupRef = useRef()
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle float ONLY — no rotation
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <Island />
      <House />
      <Steps />
      <DeskSetup onSelect={onSelect} />
      {/* Chair REMOVED as requested */}
      <Tree position={[2.0, 0.28, -1.3]} />
      <Tree position={[-1.5, 0.28, -1.9]} />
      <Lantern position={[-1.7, 0.28, -0.5]} />
      <Campfire position={[0.0, 0.28, 0.95]} />
      <Mailbox onSelect={onSelect} />
      <WelcomeSign onSelect={onSelect} />
      <ProjectCanvas onSelect={onSelect} />
      <SocialBadges onSelect={onSelect} />
      <SmallPlant position={[-2.4, 0.28, -1.8]} />
      <SmallPlant position={[ 2.6, 0.28, -0.6]} />
      <SmallPlant position={[-1.2, 0.28,  2.2]} />
      <Rocks />
    </group>
  )
}

export default FloatingIslandScene
