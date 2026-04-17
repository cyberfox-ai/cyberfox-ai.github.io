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

// ── 2-wall open room (back + left only, open front + right) ───────────────
function House() {
  return (
    <group position={[0.1, 0.27, -0.5]}>

      {/* ── Wooden plank floor ── */}
      {/* Base slab */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.06, 2.0]} />
        <meshStandardMaterial color="#d8d4cc" roughness={0.8} />
      </mesh>
      {/* Floor planks — horizontal strips */}
      {[-0.82, -0.46, -0.1, 0.26, 0.62, 0.98].map((z, i) => (
        <mesh key={i} position={[0, 0.054, z - 0.1]} receiveShadow>
          <boxGeometry args={[2.58, 0.012, 0.3]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#d4d0c8' : '#ccc8c0'} roughness={0.75} />
        </mesh>
      ))}
      {/* Plank gap lines */}
      {[-0.82, -0.46, -0.1, 0.26, 0.62].map((z, i) => (
        <mesh key={i} position={[0, 0.061, z + 0.15]}>
          <boxGeometry args={[2.58, 0.004, 0.008]} />
          <meshStandardMaterial color="#b8b4ac" roughness={0.9} />
        </mesh>
      ))}

      {/* ── Back wall ── */}
      <mesh position={[0, 1.0, -0.96]} castShadow>
        <boxGeometry args={[2.62, 2.0, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.65} />
      </mesh>
      {/* Back wall inner face (slightly different shade) */}
      <mesh position={[0, 1.0, -0.91]}>
        <boxGeometry args={[2.6, 1.98, 0.01]} />
        <meshStandardMaterial color={C.accent} roughness={0.6} />
      </mesh>

      {/* ── Left wall ── */}
      <mesh position={[-1.25, 1.0, -0.06]} castShadow>
        <boxGeometry args={[0.1, 2.0, 1.9]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.65} />
      </mesh>
      {/* Left wall inner face */}
      <mesh position={[-1.2, 1.0, -0.06]}>
        <boxGeometry args={[0.01, 1.98, 1.88]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>

      {/* ── Corner column where back meets left ── */}
      <mesh position={[-1.25, 1.0, -0.96]} castShadow>
        <boxGeometry args={[0.1, 2.0, 0.1]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.65} />
      </mesh>


      {/* ── Window on LEFT wall ── (matches reference exactly) */}
      {/* Window frame */}
      <mesh position={[-1.21, 1.08, -0.28]}>
        <boxGeometry args={[0.07, 0.62, 0.68]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.55} />
      </mesh>
      {/* Glass pane */}
      <mesh position={[-1.19, 1.08, -0.28]}>
        <boxGeometry args={[0.025, 0.54, 0.6]} />
        <meshStandardMaterial color="#c8ddf5" roughness={0.05} transparent opacity={0.7} />
      </mesh>
      {/* Vertical divider */}
      <mesh position={[-1.185, 1.08, -0.28]}>
        <boxGeometry args={[0.02, 0.54, 0.018]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.5} />
      </mesh>
      {/* Horizontal divider */}
      <mesh position={[-1.185, 1.08, -0.28]}>
        <boxGeometry args={[0.02, 0.018, 0.6]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.5} />
      </mesh>
      {/* Window sill */}
      <mesh position={[-1.18, 0.75, -0.28]}>
        <boxGeometry args={[0.06, 0.055, 0.76]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
      {/* Window top ledge */}
      <mesh position={[-1.18, 1.41, -0.28]}>
        <boxGeometry args={[0.06, 0.04, 0.72]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>

      {/* ── Back wall shelf (upper right area) ── */}
      <mesh position={[0.7, 1.62, -0.88]}>
        <boxGeometry args={[0.96, 0.058, 0.22]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
      {/* Shelf bracket left */}
      <mesh position={[0.24, 1.5, -0.88]}>
        <boxGeometry args={[0.03, 0.22, 0.18]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
      {/* Shelf bracket right */}
      <mesh position={[1.16, 1.5, -0.88]}>
        <boxGeometry args={[0.03, 0.22, 0.18]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>

      {/* Radio on shelf */}
      <mesh position={[1.02, 1.73, -0.8]}>
        <boxGeometry args={[0.28, 0.16, 0.19]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      {/* Radio dial */}
      <mesh position={[1.02, 1.74, -0.71]}>
        <cylinderGeometry args={[0.048, 0.048, 0.02, 14]} />
        <meshStandardMaterial color={C.socDk} roughness={0.4} />
      </mesh>
      {/* Radio speaker grille lines */}
      {[-0.04, 0, 0.04].map((dy, i) => (
        <mesh key={i} position={[0.88, 1.73 + dy, -0.71]}>
          <boxGeometry args={[0.07, 0.01, 0.02]} />
          <meshStandardMaterial color={C.wallDk} roughness={0.5} />
        </mesh>
      ))}
      {/* Radio antenna */}
      <mesh position={[1.1, 1.9, -0.8]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.22, 5]} />
        <meshStandardMaterial color={C.socDk} roughness={0.5} />
      </mesh>

      {/* Books stack on shelf */}
      <group position={[0.44, 1.73, -0.82]}>
        {/* Lying flat stack */}
        {[0, 0.03, 0.06].map((dy, i) => (
          <mesh key={i} position={[0, dy, 0]}>
            <boxGeometry args={[0.22, 0.028, 0.16]} />
            <meshStandardMaterial color={[C.socDk, C.wallDk, C.wall][i]} roughness={0.7} />
          </mesh>
        ))}
        {/* Standing books */}
        {[0.28, 0.34, 0.41].map((x, i) => (
          <mesh key={i} position={[x, 0.1, 0]}>
            <boxGeometry args={[0.055, 0.2, 0.15]} />
            <meshStandardMaterial color={[C.wall, C.socDk, C.wallDk][i]} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Skirting / baseboard along both walls ── */}
      <mesh position={[0, 0.1, -0.91]}>
        <boxGeometry args={[2.58, 0.14, 0.04]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.7} />
      </mesh>
      <mesh position={[-1.2, 0.1, -0.06]}>
        <boxGeometry args={[0.04, 0.14, 1.84]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.7} />
      </mesh>

      {/* ── Interior lights ── */}
      {/* Main ceiling light */}
      <pointLight position={[0.2, 1.8, -0.2]} intensity={2.2} color="#ffe8c0" distance={4.0} decay={2} />
      {/* Secondary fill from open side */}
      <pointLight position={[1.0, 1.2, 0.6]} intensity={0.6} color="#d0d8f0" distance={3.0} decay={2} />
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
        arr.push({
          x: (c - rows[r] / 2 + 0.5) * 0.043 + offsets[r],
          z: (r - 2) * 0.044,
        })
      }
    }
    return arr
  }, [])
  return (
    <group position={position}>
      {/* Base plate — cream/beige like old keyboards */}
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.022, 0.28]} />
        <meshStandardMaterial color="#d8d4c8" roughness={0.5} />
      </mesh>
      {/* Raised key bed */}
      <mesh position={[0, 0.014, -0.02]}>
        <boxGeometry args={[0.68, 0.01, 0.24]} />
        <meshStandardMaterial color="#ccc8bc" roughness={0.5} />
      </mesh>
      {keys.map((k, i) => (
        <mesh key={i} position={[k.x, 0.022, k.z - 0.02]}>
          <boxGeometry args={[0.036, 0.016, 0.038]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.4} />
        </mesh>
      ))}
      {/* Space bar */}
      <mesh position={[0.02, 0.022, 0.1]}>
        <boxGeometry args={[0.22, 0.016, 0.038]} />
        <meshStandardMaterial color="#c8c4b8" roughness={0.4} />
      </mesh>
    </group>
  )
}

// ── Mouse ─────────────────────────────────────────────────────────────────
function MouseWithCable({ position }) {
  // Coiled cable points
  const cablePoints = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 24; i++) {
      const t = i / 24
      const angle = t * Math.PI * 4
      const radius = 0.012 + t * 0.008
      pts.push(new THREE.Vector3(
        position[0] + Math.cos(angle) * radius - 0.18 + t * 0.22,
        position[1] + 0.01 + Math.sin(angle * 2) * 0.005,
        position[2] + Math.sin(angle) * radius
      ))
    }
    return pts
  }, [position])
 
  const cableCurve = useMemo(() => new THREE.CatmullRomCurve3(cablePoints), [cablePoints])
  const cableGeom = useMemo(() => new THREE.TubeGeometry(cableCurve, 32, 0.004, 5, false), [cableCurve])
 
  return (
    <group>
      {/* Mouse body — rounded oblong box style */}
      <mesh position={position} castShadow>
        <capsuleGeometry args={[0.03, 0.065, 6, 12]} />
        <meshStandardMaterial color="#d0ccbe" roughness={0.4} />
      </mesh>
      {/* Left/right button split line */}
      <mesh position={[position[0], position[1] + 0.032, position[2] - 0.01]}>
        <boxGeometry args={[0.002, 0.003, 0.05]} />
        <meshStandardMaterial color="#b8b4a8" roughness={0.5} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[position[0], position[1] + 0.033, position[2] - 0.012]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.014, 8]} />
        <meshStandardMaterial color="#888880" roughness={0.4} />
      </mesh>
      {/* Coiled cable */}
      <mesh geometry={cableGeom}>
        <meshStandardMaterial color="#b0aca0" roughness={0.6} />
      </mesh>
    </group>
  )
}

// ── CRT Monitor helper ────────────────────────────────────────────────────
// Big chunky old-school box monitor like in the reference image
function CRTMonitor({ position, rotation = [0,0,0], screenColor, screenContent, width = 0.82, height = 0.62, depth = 0.52 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main CRT body — deep box */}
      <mesh castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#d4d0c4" roughness={0.65} />
      </mesh>
      {/* Front face slightly lighter */}
      <mesh position={[0, 0, depth/2 - 0.001]}>
        <boxGeometry args={[width, height, 0.01]} />
        <meshStandardMaterial color="#dedad0" roughness={0.6} />
      </mesh>
      {/* Screen bezel — inset */}
      <mesh position={[0, 0.04, depth/2 + 0.005]}>
        <boxGeometry args={[width * 0.82, height * 0.72, 0.018]} />
        <meshStandardMaterial color="#c8c4b8" roughness={0.5} />
      </mesh>
      {/* Screen glass — slightly convex look */}
      <mesh position={[0, 0.04, depth/2 + 0.016]}>
        <boxGeometry args={[width * 0.76, height * 0.66, 0.008]} />
        <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.15} roughness={0.05} transparent opacity={0.92} />
      </mesh>
      {/* Screen content */}
      {screenContent}
      {/* Bottom chin — buttons area */}
      <mesh position={[0, -height*0.38, depth/2 + 0.006]}>
        <boxGeometry args={[width * 0.5, height * 0.1, 0.01]} />
        <meshStandardMaterial color="#c0bcb0" roughness={0.6} />
      </mesh>
      {/* Power button */}
      <mesh position={[width*0.28, -height*0.38, depth/2 + 0.012]}>
        <cylinderGeometry args={[0.018, 0.018, 0.012, 10]} />
        <meshStandardMaterial color="#a8a49a" roughness={0.4} />
      </mesh>
      {/* Small indicator LED */}
      <mesh position={[width*0.28, -height*0.38 + 0.04, depth/2 + 0.012]}>
        <sphereGeometry args={[0.006, 6, 6]} />
        <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={2} roughness={0.1} />
      </mesh>
      {/* Side vent lines */}
      {[0, 0.04, 0.08].map((dy, i) => (
        <mesh key={i} position={[width/2 + 0.002, 0.1 - dy, 0]} rotation={[0, Math.PI/2, 0]}>
          <boxGeometry args={[depth * 0.5, 0.008, 0.004]} />
          <meshStandardMaterial color="#c0bcb0" roughness={0.7} />
        </mesh>
      ))}
      {/* CRT neck/stand */}
      <mesh position={[0, -height/2 - 0.04, 0]}>
        <boxGeometry args={[width * 0.55, 0.06, depth * 0.55]} />
        <meshStandardMaterial color="#c8c4b8" roughness={0.6} />
      </mesh>
      <mesh position={[0, -height/2 - 0.08, 0]}>
        <boxGeometry args={[width * 0.45, 0.04, depth * 0.45]} />
        <meshStandardMaterial color="#c0bcb0" roughness={0.6} />
      </mesh>
    </group>
  )
}
 
// ── Desk Setup (retro reference style) ────────────────────────────────────
function DeskSetup({ onSelect }) {
  return (
    <group position={[0.1, 0.27, -0.55]} onClick={(e) => { e.stopPropagation(); onSelect('projects') }}>
 
      {/* ── Desk surface ── */}
      {/* Main top */}
      <mesh position={[0, 0.7, -0.05]} castShadow>
        <boxGeometry args={[2.0, 0.07, 0.95]} />
        <meshStandardMaterial color="#dedad4" roughness={0.55} />
      </mesh>
      {/* Front edge lip */}
      <mesh position={[0, 0.675, 0.455]}>
        <boxGeometry args={[2.0, 0.04, 0.04]} />
        <meshStandardMaterial color="#c8c4be" roughness={0.55} />
      </mesh>
 
      {/* ── Right drawer tower (like reference) ── */}
      <mesh position={[0.8, 0.34, -0.05]} castShadow>
        <boxGeometry args={[0.38, 0.68, 0.88]} />
        <meshStandardMaterial color="#d8d4ce" roughness={0.6} />
      </mesh>
      {/* Drawer fronts — 3 drawers */}
      {[0.54, 0.34, 0.14].map((y, i) => (
        <group key={i}>
          <mesh position={[0.8, y, 0.41]}>
            <boxGeometry args={[0.34, 0.16, 0.04]} />
            <meshStandardMaterial color="#e0dcd6" roughness={0.5} />
          </mesh>
          {/* Drawer handle */}
          <mesh position={[0.8, y, 0.435]}>
            <boxGeometry args={[0.1, 0.026, 0.018]} />
            <meshStandardMaterial color="#b0aca6" roughness={0.35} metalness={0.2} />
          </mesh>
        </group>
      ))}
 
      {/* ── Left leg panel ── */}
      <mesh position={[-0.88, 0.34, -0.05]} castShadow>
        <boxGeometry args={[0.06, 0.68, 0.86]} />
        <meshStandardMaterial color="#d0ccc6" roughness={0.65} />
      </mesh>
 
      {/* ── Monitors ── */}
 
 
      {/* CENTER-BACK: Big CRT monitor (Kali Linux / code) */}
      <group position={[0.08, 1.08, -0.44]}>
        <CRTMonitor
          position={[0, 0, 0]}
          width={0.84} height={0.64} depth={0.5}
          screenColor="#0d1117"
          screenContent={
            <group position={[0, 0.04, 0.275]}>
              {/* Kali dragon wallpaper */}
              <mesh position={[0, 0, 0.001]}>
                <boxGeometry args={[0.62, 0.41, 0.001]} />
                <meshStandardMaterial color="#0d1a3a" roughness={0.05} />
              </mesh>
              {/* Dragon silhouette */}
              <mesh position={[0, 0.02, 0.003]}>
                <boxGeometry args={[0.18, 0.32, 0.001]} />
                <meshStandardMaterial color="#1a3a88" emissive="#1a3a88" emissiveIntensity={0.5} roughness={0.1} />
              </mesh>
              {/* Wings */}
              <mesh position={[-0.14, 0.04, 0.003]} rotation={[0,0,0.25]}>
                <boxGeometry args={[0.18, 0.22, 0.001]} />
                <meshStandardMaterial color="#152e70" emissive="#152e70" emissiveIntensity={0.4} roughness={0.1} />
              </mesh>
              <mesh position={[0.14, 0.04, 0.003]} rotation={[0,0,-0.25]}>
                <boxGeometry args={[0.18, 0.22, 0.001]} />
                <meshStandardMaterial color="#152e70" emissive="#152e70" emissiveIntensity={0.4} roughness={0.1} />
              </mesh>
              {/* Code lines overlay */}
              {[0.14, 0.08, 0.02, -0.04, -0.1].map((y, i) => (
                <mesh key={i} position={[-0.1 + (i%2)*0.06, y, 0.005]}>
                  <boxGeometry args={[0.2 + (i%3)*0.05, 0.014, 0.001]} />
                  <meshStandardMaterial color="#4488ff" emissive="#4488ff" emissiveIntensity={1.2} roughness={0.1} />
                </mesh>
              ))}
              {/* </> symbol */}
              <mesh position={[0.16, 0.02, 0.005]}>
                <boxGeometry args={[0.1, 0.06, 0.001]} />
                <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={2} roughness={0.1} />
              </mesh>
              <pointLight position={[0, 0, 0.15]} intensity={0.5} color="#2244aa" distance={1.4} decay={2} />
            </group>
          }
        />
      </group>
 
      {/* ── Keyboard & Mouse ── */}
      <Keyboard position={[0.05, 0.737, 0.05]} />
      <MouseWithCable position={[0.6, 0.738, 0.05]} />
 
      {/* ── Arc desk lamp (like reference) ── */}
      <group position={[0.82, 0.73, -0.32]}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.035, 12]} />
          <meshStandardMaterial color="#d0ccbe" roughness={0.5} />
        </mesh>
        {/* Vertical stem */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.014, 0.016, 0.52, 8]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.45} />
        </mesh>
        {/* Arc arm */}
        <mesh position={[-0.04, 0.56, -0.06]} rotation={[0.5, 0, -0.1]}>
          <cylinderGeometry args={[0.012, 0.014, 0.32, 8]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.45} />
        </mesh>
        {/* Lamp head — round dome shade like reference */}
        <mesh position={[-0.1, 0.72, -0.18]} rotation={[1.0, 0, 0.1]}>
          <sphereGeometry args={[0.1, 10, 8, 0, Math.PI*2, 0, Math.PI*0.55]} />
          <meshStandardMaterial color="#dedad2" roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner glow bulb */}
        <mesh position={[-0.09, 0.68, -0.18]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshStandardMaterial color="#ffe8c0" emissive="#ffe8c0" emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
        <pointLight position={[-0.09, 0.62, -0.2]} intensity={2.4} color="#ffe8c0" distance={2.8} decay={2} />
      </group>
 
      {/* ── Coffee mug ── */}
      <group position={[0.54, 0.738, -0.24]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.046, 0.040, 0.085, 14]} />
          <meshStandardMaterial color="#d8d4ce" roughness={0.5} />
        </mesh>
        {/* Coffee inside */}
        <mesh position={[0, 0.038, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.003, 14]} />
          <meshStandardMaterial color="#3a1a08" roughness={0.3} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.058, 0.01, 0]} rotation={[0, 0, Math.PI/2]}>
          <torusGeometry args={[0.024, 0.007, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#d0ccc6" roughness={0.5} />
        </mesh>
      </group>
 
      {/* ── Books stack (right of lamp like reference) ── */}
      <group position={[0.3, 0.738, -0.36]}>
        {[
          { h: 0.028, w: 0.18, d: 0.14, col: '#c8c4b8', dy: 0 },
          { h: 0.025, w: 0.17, d: 0.13, col: '#b8b4a8', dy: 0.028 },
          { h: 0.022, w: 0.16, d: 0.12, col: '#c4c0b4', dy: 0.053 },
        ].map((b, i) => (
          <mesh key={i} position={[0, b.dy + b.h/2, 0]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.col} roughness={0.7} />
          </mesh>
        ))}
      </group>
 
      {/* ── Notepad / sticky note ── */}
      <group position={[0.44, 0.738, -0.1]}>
        <mesh>
          <boxGeometry args={[0.14, 0.008, 0.12]} />
          <meshStandardMaterial color="#f5f0e0" roughness={0.7} />
        </mesh>
        {[0.03, 0.01, -0.01, -0.03].map((dz, i) => (
          <mesh key={i} position={[0, 0.006, dz]}>
            <boxGeometry args={[0.1, 0.002, 0.007]} />
            <meshStandardMaterial color="#cccccc" roughness={0.5} />
          </mesh>
        ))}
        {/* Pen */}
        <mesh position={[0.08, 0.012, 0]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.14, 6]} />
          <meshStandardMaterial color="#888880" roughness={0.4} />
        </mesh>
      </group>
 
      {/* ── Small plant pot on right corner ── */}
      <group position={[0.76, 0.742, 0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.044, 0.052, 0.07, 10]} />
          <meshStandardMaterial color="#c07040" roughness={0.8} />
        </mesh>
        {[0,1,2].map(i => (
          <mesh key={i} position={[Math.sin(i*2.09)*0.04, 0.09+i*0.015, Math.cos(i*2.09)*0.04]}>
            <sphereGeometry args={[0.05, 6, 5]} />
            <meshStandardMaterial color="#d4d0c8" roughness={1.0} flatShading />
          </mesh>
        ))}
      </group>
 
    </group>
  )
}

// ── LOW-POLY FLAT LEAF (hexagonal disc shape) ─────────────────────────────
function FlatLeaf({ position, rotation, scaleX = 1, scaleZ = 1 }) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={[scaleX, 0.18, scaleZ]}
      castShadow
    >
      <cylinderGeometry args={[0.32, 0.28, 1, 6]} />
      <meshStandardMaterial color={C.island} roughness={1.0} flatShading />
    </mesh>
  )
}

// ── BRANCH SEGMENT ────────────────────────────────────────────────────────
function Branch({ start, end, rBot = 0.08, rTop = 0.05 }) {
  const s = new THREE.Vector3(...start)
  const e = new THREE.Vector3(...end)
  const dir = e.clone().sub(s)
  const len = dir.length()
  const mid = s.clone().lerp(e, 0.5)
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize()
  )
  const euler = new THREE.Euler().setFromQuaternion(quat)
  return (
    <mesh position={[mid.x, mid.y, mid.z]} rotation={[euler.x, euler.y, euler.z]} castShadow>
      <cylinderGeometry args={[rTop, rBot, len, 7]} />
      <meshStandardMaterial color={C.wood} roughness={0.85} />
    </mesh>
  )
}

// ── MAIN TREE — single tree, right of building, slight lean toward room ───
function Tree({ position = [2.0, 0.28, -1.3] }) {
  return (
    <group position={position} rotation={[0, 0.3, -0.08]}>
      {/* ── TRUNK: thick baobab segments with ring seams ── */}
      {/* Base — widest, very chunky */}
      <mesh position={[0, 0.30, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.60, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </mesh>
      {/* Lower mid */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.22, 0.50, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </mesh>
      {/* Mid bulge */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.20, 0.45, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </mesh>
      {/* Upper — narrows */}
      <mesh position={[0, 1.52, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.23, 0.42, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </mesh>
      {/* Neck — before fork */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.17, 0.36, 7]} />
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </mesh>
      {/* Fork junction sphere */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <sphereGeometry args={[0.14, 7, 5]} />
        <meshStandardMaterial color={C.wood} roughness={0.85} />
      </mesh>

      {/* ── MAIN BRANCHES — 4 arms spreading outward ── */}
      {/* Branch LEFT — sweeps far left-back */}
      <Branch start={[0, 2.02, 0]}        end={[-0.65, 2.58, -0.30]} rBot={0.10} rTop={0.07} />
      <Branch start={[-0.65, 2.58, -0.30]} end={[-1.20, 2.90, -0.10]} rBot={0.07} rTop={0.05} />
      <Branch start={[-1.20, 2.90, -0.10]} end={[-1.68, 3.05,  0.20]} rBot={0.05} rTop={0.03} />

      {/* Branch RIGHT — sweeps far right-forward */}
      <Branch start={[0, 2.02, 0]}       end={[0.62, 2.55,  0.28]} rBot={0.10} rTop={0.07} />
      <Branch start={[0.62, 2.55, 0.28]} end={[1.18, 2.88,  0.08]} rBot={0.07} rTop={0.05} />
      <Branch start={[1.18, 2.88, 0.08]} end={[1.65, 3.02, -0.18]} rBot={0.05} rTop={0.03} />

      {/* Branch BACK-LEFT — goes up-back */}
      <Branch start={[0, 2.02, 0]}         end={[-0.30, 2.60, -0.62]} rBot={0.09} rTop={0.06} />
      <Branch start={[-0.30, 2.60, -0.62]} end={[-0.20, 2.95, -1.10]} rBot={0.06} rTop={0.04} />
      <Branch start={[-0.20, 2.95, -1.10]} end={[ 0.10, 3.08, -1.50]} rBot={0.04} rTop={0.02} />

      {/* Branch FRONT-RIGHT — goes up-forward */}
      <Branch start={[0, 2.02, 0]}        end={[0.28, 2.58,  0.60]} rBot={0.09} rTop={0.06} />
      <Branch start={[0.28, 2.58, 0.60]}  end={[0.15, 2.92,  1.08]} rBot={0.06} rTop={0.04} />
      <Branch start={[0.15, 2.92, 1.08]}  end={[-0.15, 3.05, 1.45]} rBot={0.04} rTop={0.02} />

      {/* ── TWIGS off main branches ── */}
      <Branch start={[-0.65, 2.58, -0.30]} end={[-0.80, 2.95,  0.28]} rBot={0.04} rTop={0.02} />
      <Branch start={[-1.20, 2.90, -0.10]} end={[-1.05, 3.18, -0.55]} rBot={0.04} rTop={0.02} />
      <Branch start={[ 0.62, 2.55,  0.28]} end={[ 0.75, 2.92, -0.28]} rBot={0.04} rTop={0.02} />
      <Branch start={[ 1.18, 2.88,  0.08]} end={[ 1.02, 3.16,  0.52]} rBot={0.04} rTop={0.02} />
      <Branch start={[-0.30, 2.60, -0.62]} end={[ 0.18, 2.90, -0.70]} rBot={0.03} rTop={0.02} />
      <Branch start={[ 0.28, 2.58,  0.60]} end={[-0.18, 2.88,  0.72]} rBot={0.03} rTop={0.02} />

      {/* ══ FLAT HEX LEAVES — scattered at all branch/twig ends ══ */}

      {/* LEFT arm leaves */}
      <FlatLeaf position={[-1.68, 3.10,  0.20]} rotation={[0.20, 0.5, 0.15]}  scaleX={1.1} scaleZ={0.9} />
      <FlatLeaf position={[-1.50, 3.05, -0.10]} rotation={[-0.15, 1.2, 0.10]} scaleX={0.9} scaleZ={1.0} />
      <FlatLeaf position={[-1.35, 3.18,  0.40]} rotation={[0.25, 0.8, -0.12]} scaleX={1.0} scaleZ={0.85} />
      <FlatLeaf position={[-1.15, 2.98, -0.52]} rotation={[-0.20, 2.0, 0.18]} scaleX={1.0} scaleZ={0.9} />
      <FlatLeaf position={[-0.85, 3.00,  0.35]} rotation={[0.18, 0.3, 0.08]}  scaleX={0.9} scaleZ={0.85} />
      <FlatLeaf position={[-0.92, 3.22, -0.40]} rotation={[0.22, 1.5, -0.15]} scaleX={0.85} scaleZ={0.90} />
      <FlatLeaf position={[-1.55, 2.88,  0.55]} rotation={[0.30, 0.2, 0.20]}  scaleX={0.80} scaleZ={0.75} />
      <FlatLeaf position={[-1.78, 3.00, -0.30]} rotation={[-0.10, 1.8, 0.12]} scaleX={0.95} scaleZ={0.80} />

      {/* RIGHT arm leaves */}
      <FlatLeaf position={[1.65, 3.08, -0.18]}  rotation={[0.18, -0.5, -0.12]} scaleX={1.1} scaleZ={0.9} />
      <FlatLeaf position={[1.48, 3.02,  0.14]}  rotation={[-0.12, -1.2, 0.10]} scaleX={0.9} scaleZ={1.0} />
      <FlatLeaf position={[1.32, 3.20, -0.40]}  rotation={[0.22, -0.8, 0.14]}  scaleX={1.0} scaleZ={0.85} />
      <FlatLeaf position={[1.12, 2.96,  0.50]}  rotation={[-0.18, -2.0, -0.18]} scaleX={1.0} scaleZ={0.9} />
      <FlatLeaf position={[0.82, 3.02, -0.32]}  rotation={[0.15, -0.3, -0.08]}  scaleX={0.9} scaleZ={0.85} />
      <FlatLeaf position={[0.90, 3.24,  0.42]}  rotation={[0.20, -1.5, 0.16]}   scaleX={0.85} scaleZ={0.9} />
      <FlatLeaf position={[1.50, 2.85, -0.52]}  rotation={[0.28, -0.2, -0.18]}  scaleX={0.8} scaleZ={0.75} />
      <FlatLeaf position={[1.72, 2.98,  0.28]}  rotation={[-0.08, -1.8, -0.12]} scaleX={0.95} scaleZ={0.8} />

      {/* BACK-LEFT arm leaves */}
      <FlatLeaf position={[0.10, 3.14, -1.50]}  rotation={[0.30, 0.1, 0.08]}   scaleX={1.0} scaleZ={0.9} />
      <FlatLeaf position={[-0.25, 3.05, -1.32]} rotation={[-0.15, 0.9, -0.10]} scaleX={0.9} scaleZ={0.85} />
      <FlatLeaf position={[0.32, 3.00, -1.20]}  rotation={[0.20, 1.6, 0.15]}   scaleX={0.85} scaleZ={0.9} />
      <FlatLeaf position={[-0.15, 3.22, -1.00]} rotation={[0.25, 0.4, -0.12]}  scaleX={0.9} scaleZ={0.8} />
      <FlatLeaf position={[0.18, 2.88, -0.82]}  rotation={[-0.10, 2.2, 0.18]}  scaleX={0.8} scaleZ={0.75} />
      <FlatLeaf position={[0.22, 3.10, -0.68]}  rotation={[0.15, 0.7, 0.10]}   scaleX={0.75} scaleZ={0.8} />

      {/* FRONT-RIGHT arm leaves */}
      <FlatLeaf position={[-0.15, 3.12,  1.45]} rotation={[0.28, -0.1, -0.08]}  scaleX={1.0} scaleZ={0.9} />
      <FlatLeaf position={[0.22, 3.02,  1.28]}  rotation={[-0.12, -0.9, 0.10]}  scaleX={0.9} scaleZ={0.85} />
      <FlatLeaf position={[-0.35, 2.98,  1.18]} rotation={[0.18, -1.6, -0.15]}  scaleX={0.85} scaleZ={0.9} />
      <FlatLeaf position={[0.12, 3.20,  0.98]}  rotation={[0.22, -0.4, 0.12]}   scaleX={0.9} scaleZ={0.8} />
      <FlatLeaf position={[-0.20, 2.86,  0.80]} rotation={[-0.10, -2.2, -0.18]} scaleX={0.8} scaleZ={0.75} />
      <FlatLeaf position={[-0.25, 3.08,  0.65]} rotation={[0.15, -0.7, -0.10]}  scaleX={0.75} scaleZ={0.8} />

      {/* CENTER / fill leaves near fork */}
      <FlatLeaf position={[-0.40, 2.75, -0.20]} rotation={[0.12, 0.6, 0.08]}   scaleX={0.85} scaleZ={0.80} />
      <FlatLeaf position={[ 0.38, 2.78,  0.18]} rotation={[0.10, -0.6, -0.08]} scaleX={0.85} scaleZ={0.80} />
      <FlatLeaf position={[-0.15, 2.72,  0.35]} rotation={[0.15, 1.2, 0.10]}   scaleX={0.80} scaleZ={0.75} />
      <FlatLeaf position={[ 0.15, 2.74, -0.32]} rotation={[0.12, -1.2, -0.10]} scaleX={0.80} scaleZ={0.75} />
      <FlatLeaf position={[-0.55, 2.82,  0.50]} rotation={[0.20, 0.9, 0.12]}   scaleX={0.78} scaleZ={0.72} />
      <FlatLeaf position={[ 0.52, 2.80, -0.48]} rotation={[0.18, -0.9, -0.12]} scaleX={0.78} scaleZ={0.72} />
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



// ── Mailbox — dome capsule shape on disc base ─────────────────────────────
function Mailbox({ onSelect }) {
  return (
    <group
      position={[-2.2, 0.28, 0.5]}
      rotation={[0, 0.3, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect('contact') }}
    >
      {/* Base disc */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.055, 18]} />
        <meshStandardMaterial color={C.accent} roughness={0.75} />
      </mesh>
      {/* Neck stem */}
      <mesh position={[0, 0.10, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.14, 12]} />
        <meshStandardMaterial color={C.accent} roughness={0.75} />
      </mesh>
      {/* Body cylinder */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.195, 0.195, 0.38, 16]} />
        <meshStandardMaterial color={C.accent} roughness={0.72} />
      </mesh>
      {/* Dome top */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.195, 16, 12, 0, Math.PI*2, 0, Math.PI/2]} />
        <meshStandardMaterial color={C.accent} roughness={0.72} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, 0.27, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.195, 16, 12, 0, Math.PI*2, 0, Math.PI/2]} />
        <meshStandardMaterial color={C.accent} roughness={0.72} />
      </mesh>
      {/* Dark opening cavity */}
      <mesh position={[0, 0.48, 0.178]}>
        <boxGeometry args={[0.26, 0.28, 0.04]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.85} />
      </mesh>
      {/* Arch top of opening */}
      <mesh position={[0, 0.62, 0.178]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.04, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.85} />
      </mesh>
      {/* Envelope */}
      <mesh position={[0, 0.50, 0.168]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.17, 0.12, 0.016]} />
        <meshStandardMaterial color="#f0ede0" roughness={0.6} />
      </mesh>
      {/* Side latch */}
      <mesh position={[0.20, 0.46, 0.02]} castShadow>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color={C.wallDk} roughness={0.6} />
      </mesh>
    </group>
  )
}


// ── Rounded Square Badge base ─────────────────────────────────────────────
function BadgeBase({ color }) {
  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.30, 0.06, 0.30]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      {/* 4 corner spheres for rounding */}
      {[[-0.13,-0.13],[0.13,-0.13],[-0.13,0.13],[0.13,0.13]].map(([x,z],i) => (
        <mesh key={i} position={[x, 0, z]} castShadow>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
      {/* Top face inset — darker panel */}
      <mesh position={[0, 0.032, 0]}>
        <boxGeometry args={[0.24, 0.008, 0.24]} />
        <meshStandardMaterial color="#2a2035" roughness={0.4} />
      </mesh>
      {/* Top face corner fills */}
      {[[-0.10,-0.10],[0.10,-0.10],[-0.10,0.10],[0.10,0.10]].map(([x,z],i) => (
        <mesh key={i} position={[x, 0.032, z]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#2a2035" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function GithubBadge({ position }) {
  const base = '#dcd8ea'
  const icon = '#2b1a12'

  return (
    <group
      position={position}
      rotation={[0, Math.PI / 4, 0]} // slight angle like reference
      onClick={(e) => {
        e.stopPropagation()
        window.open('https://github.com', '_blank')
      }}
    >
      {/* ── TILE (standing vertical) ── */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        
        {/* Base */}
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.06, 0.34]} />
          <meshStandardMaterial color={base} roughness={0.6} />
        </mesh>

        {/* Rounded corners */}
        {[[-0.15,-0.15],[0.15,-0.15],[-0.15,0.15],[0.15,0.15]].map(([x,z],i)=>(
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={base} />
          </mesh>
        ))}

        {/* Slight inner bevel */}
        <mesh position={[0, 0.032, 0]}>
          <boxGeometry args={[0.26, 0.01, 0.26]} />
          <meshStandardMaterial color="#cfcbe0" />
        </mesh>

        {/* ── REAL OCTOCAT STYLE (clean silhouette) ── */}
        <group position={[0, 0.04, 0]}>

          {/* HEAD */}
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.012, 32]} />
            <meshStandardMaterial color={icon} />
          </mesh>

          {/* EARS */}
          <mesh position={[-0.05, 0, -0.06]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.028, 0.05, 3]} />
            <meshStandardMaterial color={icon} />
          </mesh>

          <mesh position={[0.05, 0, -0.06]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.028, 0.05, 3]} />
            <meshStandardMaterial color={icon} />
          </mesh>

          {/* BODY */}
          <mesh position={[0, 0, 0.075]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.05, 0.014, 24]} />
            <meshStandardMaterial color={icon} />
          </mesh>

          {/* TAIL (CURVED — key realism) */}
          <mesh position={[0, 0, 0.115]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.035, 0.01, 10, 30, Math.PI * 1.3]} />
            <meshStandardMaterial color={icon} />
          </mesh>

          {/* SMALL BODY TAPER */}
          <mesh position={[0, 0, 0.095]} rotation={[Math.PI/2, 0, 0]}>
            <coneGeometry args={[0.025, 0.03, 8]} />
            <meshStandardMaterial color={icon} />
          </mesh>

        </group>
      </group>

      {/* Lighting for realism */}
      <pointLight position={[0.1, 0.2, 0.2]} intensity={0.4} />
    </group>
  )
}

// ── YouTube Badge ─────────────────────────────────────────────────────────
function YoutubeBadge({ position, onSelect }) {
  const col = '#c4bdd4'
  const iconCol = '#1a1025'
  const y = 0.036

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); window.open('https://youtube.com', '_blank') }}>
      <BadgeBase color={col} />
      {/* ── YouTube play button ── */}
      <group position={[0, y, 0]}>
        {/* Rounded rect background */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <boxGeometry args={[0.13, 0.006, 0.095]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Corner rounds on rect */}
        {[[-0.055,-0.035],[0.055,-0.035],[-0.055,0.035],[0.055,0.035]].map(([x,z],i) => (
          <mesh key={i} position={[x, 0, z]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.006, 10]} />
            <meshStandardMaterial color={iconCol} roughness={0.3} />
          </mesh>
        ))}
        {/* Play triangle */}
        <mesh position={[0.008, 0.001, 0]} rotation={[Math.PI/2, 0, Math.PI/2]}>
          <coneGeometry args={[0.030, 0.048, 3]} />
          <meshStandardMaterial color={col} roughness={0.3} />
        </mesh>
      </group>
      <pointLight position={[0, 0.15, 0]} intensity={0.3} color="#ffffff" distance={0.6} decay={2} />
    </group>
  )
}

// ── Instagram Badge ───────────────────────────────────────────────────────
function InstagramBadge({ position }) {
  const col = '#c4bdd4'
  const iconCol = '#1a1025'
  const y = 0.036

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); window.open('https://instagram.com', '_blank') }}>
      <BadgeBase color={col} />
      <group position={[0, y, 0]}>
        {/* Outer rounded square ring */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.060, 0.012, 6, 4]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Inner circle */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.030, 0.010, 8, 16]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Corner dot */}
        <mesh position={[0.046, 0, -0.046]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
      </group>
      <pointLight position={[0, 0.15, 0]} intensity={0.3} color="#ffffff" distance={0.6} decay={2} />
    </group>
  )
}

// ── X (Twitter) Badge ─────────────────────────────────────────────────────
function XBadge({ position }) {
  const col = '#c4bdd4'
  const iconCol = '#1a1025'
  const y = 0.037

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); window.open('https://x.com', '_blank') }}>
      <BadgeBase color={col} />
      <group position={[0, y, 0]}>
        <mesh rotation={[Math.PI/2, 0, Math.PI/4]}>
          <boxGeometry args={[0.13, 0.006, 0.022]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, -Math.PI/4]}>
          <boxGeometry args={[0.13, 0.006, 0.022]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
      </group>
      <pointLight position={[0, 0.15, 0]} intensity={0.3} color="#ffffff" distance={0.6} decay={2} />
    </group>
  )
}

// ── LinkedIn Badge ────────────────────────────────────────────────────────
function LinkedInBadge({ position }) {
  const col = '#c4bdd4'
  const iconCol = '#1a1025'
  const y = 0.037

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); window.open('https://linkedin.com', '_blank') }}>
      <BadgeBase color={col} />
      <group position={[0, y, 0]}>
        {/* Left vertical bar */}
        <mesh position={[-0.042, 0, 0.008]} rotation={[Math.PI/2, 0, 0]}>
          <boxGeometry args={[0.018, 0.006, 0.082]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Dot above left bar */}
        <mesh position={[-0.042, 0, -0.050]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Right vertical bar */}
        <mesh position={[0.022, 0, 0.012]} rotation={[Math.PI/2, 0, 0]}>
          <boxGeometry args={[0.018, 0.006, 0.075]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Arch/curve for n shape */}
        <mesh position={[0.050, 0, -0.015]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.026, 0.010, 6, 10, Math.PI]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
        {/* Right of arch vertical */}
        <mesh position={[0.076, 0, 0.012]} rotation={[Math.PI/2, 0, 0]}>
          <boxGeometry args={[0.018, 0.006, 0.075]} />
          <meshStandardMaterial color={iconCol} roughness={0.3} />
        </mesh>
      </group>
      <pointLight position={[0, 0.15, 0]} intensity={0.3} color="#ffffff" distance={0.6} decay={2} />
    </group>
  )
}

// ── All Social Badges placed on island ───────────────────────────────────
function SocialBadges({ onSelect }) {
  return (
    <group position={[0, 0.31, 0]}>
      <GithubBadge    position={[-0.7,  0, 0.55]} onSelect={onSelect} />
      <YoutubeBadge   position={[0.0,   0, 0.55]} onSelect={onSelect} />
      <InstagramBadge position={[-0.7,  0, 1.08]} />
      <XBadge         position={[0.0,   0, 1.08]} />
      <LinkedInBadge  position={[0.70,  0, 0.80]} />
    </group>
  )
}

// ── Welcome Sign — flat stone slab lying tilted on ground ─────────────────
function WelcomeSign({ onSelect }) {
  return (
    <group
      position={[-0.4, 0.30, 1.72]}
      rotation={[0.52, -0.22, -0.38]}
      onClick={(e) => { e.stopPropagation(); onSelect('about') }}
    >
      {/* Main stone slab — chunky rounded box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.14, 0.38]} />
        <meshStandardMaterial color={C.accent} roughness={0.85} />
      </mesh>

      {/* Slightly rounded feel — thin face plate */}
      <mesh position={[0, 0.072, 0]}>
        <boxGeometry args={[0.68, 0.008, 0.34]} />
        <meshStandardMaterial color={C.islandTop} roughness={0.8} />
      </mesh>

      {/* Corner rounding blobs to give stone feel */}
      {[[-0.34, 0, -0.18], [0.34, 0, -0.18], [-0.34, 0, 0.18], [0.34, 0, 0.18]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[0.072, 7, 6]} />
          <meshStandardMaterial color={C.accent} roughness={0.85} />
        </mesh>
      ))}

      {/* "Welcome" text lines — carved look using dark raised bars */}
      {/* W */}
      <mesh position={[-0.22, 0.078, 0.01]}>
        <boxGeometry args={[0.048, 0.006, 0.115]} />
        <meshStandardMaterial color={C.woodDk} roughness={0.6} />
      </mesh>
      <mesh position={[-0.18, 0.078, 0.04]} rotation={[0, 0.38, 0]}>
        <boxGeometry args={[0.008, 0.006, 0.07]} />
        <meshStandardMaterial color={C.woodDk} roughness={0.6} />
      </mesh>
      <mesh position={[-0.14, 0.078, 0.01]} rotation={[0, -0.38, 0]}>
        <boxGeometry args={[0.008, 0.006, 0.07]} />
        <meshStandardMaterial color={C.woodDk} roughness={0.6} />
      </mesh>

      {/* Text representation — three lines of "ink" like carved stone */}
      <mesh position={[0.02, 0.078, -0.02]}>
        <boxGeometry args={[0.48, 0.007, 0.028]} />
        <meshStandardMaterial color={C.woodDk} roughness={0.5} />
      </mesh>
      <mesh position={[0.02, 0.078, 0.01]}>
        <boxGeometry args={[0.44, 0.007, 0.028]} />
        <meshStandardMaterial color={C.woodDk} roughness={0.5} />
      </mesh>
      <mesh position={[0.02, 0.078, 0.04]}>
        <boxGeometry args={[0.38, 0.007, 0.028]} />
        <meshStandardMaterial color={C.woodDk} roughness={0.5} />
      </mesh>

      {/* Subtle glow */}
      <pointLight position={[0, 0.3, 0]} intensity={0.3} color="#ffe8c0" distance={1.0} decay={2} />
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
      {/* <Tree position={[-1.5, 0.28, -1.9]} /> */}
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
