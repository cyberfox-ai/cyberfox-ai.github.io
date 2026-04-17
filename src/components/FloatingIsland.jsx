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

      {/* ── Flat roof slab ── (same blue-grey like reference) */}
      <mesh position={[0, 2.04, -0.06]} castShadow>
        <boxGeometry args={[2.72, 0.1, 2.02]} />
        <meshStandardMaterial color={C.roof} roughness={0.55} />
      </mesh>
      {/* Roof front edge strip — visible from front */}
      <mesh position={[0, 2.0, 1.0]}>
        <boxGeometry args={[2.72, 0.08, 0.06]} />
        <meshStandardMaterial color={C.roofDk} roughness={0.55} />
      </mesh>
      {/* Roof right open edge strip */}
      <mesh position={[1.3, 2.0, -0.06]}>
        <boxGeometry args={[0.06, 0.08, 2.0]} />
        <meshStandardMaterial color={C.roofDk} roughness={0.55} />
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
 
      {/* LEFT: Small angled screen (laptop/tablet style — shows terminal) */}
      <group position={[-0.52, 0.72, -0.3]} rotation={[0, 0.32, 0]}>
        {/* Screen body */}
        <mesh castShadow>
          <boxGeometry args={[0.52, 0.4, 0.06]} />
          <meshStandardMaterial color="#d4d0c4" roughness={0.6} />
        </mesh>
        {/* Screen face */}
        <mesh position={[0, 0, 0.032]}>
          <boxGeometry args={[0.48, 0.36, 0.008]} />
          <meshStandardMaterial color="#0a0f0a" roughness={0.05} />
        </mesh>
        {/* Green terminal content */}
        <mesh position={[0, 0, 0.038]}>
          <boxGeometry args={[0.44, 0.32, 0.002]} />
          <meshStandardMaterial color="#001800" roughness={0.1} />
        </mesh>
        {/* Terminal window chrome bar */}
        <mesh position={[0, 0.12, 0.04]}>
          <boxGeometry args={[0.44, 0.04, 0.002]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
        </mesh>
        {/* Window dots red/yellow/green */}
        {['#ff5f57','#ffbd2e','#28c840'].map((col, i) => (
          <mesh key={i} position={[-0.16 + i*0.03, 0.12, 0.042]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Green terminal text lines */}
        {[0.06, 0.02, -0.02, -0.06, -0.1].map((y, i) => (
          <mesh key={i} position={[-0.04 + (i%2)*0.02, y, 0.041]}>
            <boxGeometry args={[0.26 - (i%3)*0.04, 0.013, 0.001]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1.8} roughness={0.1} />
          </mesh>
        ))}
        {/* Triangle/play icon */}
        <mesh position={[-0.08, -0.02, 0.041]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.022, 0.04, 3]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff3333" emissiveIntensity={1.5} roughness={0.1} />
        </mesh>
        {/* Screen stand */}
        <mesh position={[0, -0.24, -0.02]}>
          <boxGeometry args={[0.06, 0.1, 0.06]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.3, -0.02]}>
          <boxGeometry args={[0.2, 0.03, 0.14]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.5} />
        </mesh>
        <pointLight position={[0, 0, 0.2]} intensity={0.35} color="#39ff14" distance={1.0} decay={2} />
      </group>
 
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
 
      {/* RIGHT: Flat modern monitor (orange/code style) */}
      <group position={[0.7, 0.95, -0.41]}>
        {/* Thin flat panel bezel */}
        <mesh castShadow>
          <boxGeometry args={[0.62, 0.46, 0.06]} />
          <meshStandardMaterial color="#d4d0c4" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <boxGeometry args={[0.58, 0.42, 0.008]} />
          <meshStandardMaterial color="#0a0a12" roughness={0.05} />
        </mesh>
        {/* Orange warm content */}
        <mesh position={[0, 0, 0.038]}>
          <boxGeometry args={[0.54, 0.38, 0.002]} />
          <meshStandardMaterial color="#1a0e00" roughness={0.1} />
        </mesh>
        {/* Colorful UI bars (like reference image shows colored horizontal bars) */}
        {[
          { y: 0.1,  w: 0.36, col: '#ff8c00' },
          { y: 0.05, w: 0.28, col: '#ffcc00' },
          { y: 0.0,  w: 0.42, col: '#ff6600' },
          { y:-0.05, w: 0.2,  col: '#ff8c00' },
        ].map((bar, i) => (
          <mesh key={i} position={[-0.04, bar.y, 0.04]}>
            <boxGeometry args={[bar.w, 0.022, 0.001]} />
            <meshStandardMaterial color={bar.col} emissive={bar.col} emissiveIntensity={1.4} roughness={0.1} />
          </mesh>
        ))}
        {/* Window dots */}
        {['#ff5f57','#ffbd2e','#28c840'].map((col, i) => (
          <mesh key={i} position={[-0.2 + i*0.03, 0.16, 0.042]}>
            <sphereGeometry args={[0.007, 6, 6]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Stand neck */}
        <mesh position={[0, -0.27, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.06]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.14]} />
          <meshStandardMaterial color="#c8c4b8" roughness={0.5} />
        </mesh>
        <pointLight position={[0, 0, 0.22]} intensity={0.4} color="#ff8800" distance={1.2} decay={2} />
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

// ── Baobab-style Tree matching reference image ────────────────────────────
function Tree({ position = [2.0, 0.28, -1.3] }) {
  // Large individual leaf blobs — wide, flat ellipsoids like the reference
  const leafBlobs = useMemo(() => [
    // Top crown center
    { x:  0.00, y: 2.55, z:  0.00, sx: 1.05, sy: 0.72, sz: 0.95 },
    { x:  0.20, y: 2.70, z: -0.15, sx: 0.85, sy: 0.60, sz: 0.80 },
    { x: -0.18, y: 2.68, z:  0.18, sx: 0.88, sy: 0.58, sz: 0.82 },

    // Right side spread
    { x:  0.82, y: 2.15, z: -0.10, sx: 1.10, sy: 0.65, sz: 0.90 },
    { x:  1.05, y: 1.90, z:  0.20, sx: 0.95, sy: 0.58, sz: 0.85 },
    { x:  1.20, y: 2.00, z: -0.35, sx: 0.90, sy: 0.55, sz: 0.78 },
    { x:  0.95, y: 2.30, z:  0.40, sx: 0.80, sy: 0.50, sz: 0.72 },
    { x:  1.28, y: 1.70, z:  0.05, sx: 0.85, sy: 0.48, sz: 0.70 },

    // Left side spread
    { x: -0.80, y: 2.10, z:  0.05, sx: 1.08, sy: 0.62, sz: 0.92 },
    { x: -1.02, y: 1.88, z: -0.25, sx: 0.92, sy: 0.56, sz: 0.84 },
    { x: -1.18, y: 2.05, z:  0.30, sx: 0.88, sy: 0.52, sz: 0.78 },
    { x: -0.90, y: 2.32, z: -0.42, sx: 0.82, sy: 0.50, sz: 0.74 },
    { x: -1.25, y: 1.72, z:  0.10, sx: 0.80, sy: 0.48, sz: 0.70 },

    // Front spread
    { x:  0.30, y: 2.00, z:  0.88, sx: 1.00, sy: 0.60, sz: 0.88 },
    { x: -0.30, y: 1.95, z:  0.92, sx: 0.95, sy: 0.58, sz: 0.82 },
    { x:  0.60, y: 1.80, z:  0.80, sx: 0.85, sy: 0.52, sz: 0.76 },
    { x: -0.55, y: 1.82, z:  0.82, sx: 0.82, sy: 0.50, sz: 0.74 },
    { x:  0.05, y: 1.78, z:  1.10, sx: 0.78, sy: 0.48, sz: 0.70 },

    // Back spread
    { x:  0.25, y: 2.05, z: -0.90, sx: 1.00, sy: 0.60, sz: 0.85 },
    { x: -0.28, y: 2.00, z: -0.88, sx: 0.95, sy: 0.58, sz: 0.82 },
    { x:  0.55, y: 1.82, z: -0.78, sx: 0.85, sy: 0.52, sz: 0.75 },
    { x: -0.52, y: 1.85, z: -0.80, sx: 0.82, sy: 0.50, sz: 0.72 },

    // Mid-level fill — makes canopy feel dense
    { x:  0.45, y: 2.38, z:  0.42, sx: 0.90, sy: 0.55, sz: 0.80 },
    { x: -0.42, y: 2.40, z: -0.40, sx: 0.88, sy: 0.54, sz: 0.78 },
    { x:  0.60, y: 2.20, z: -0.50, sx: 0.85, sy: 0.52, sz: 0.76 },
    { x: -0.58, y: 2.22, z:  0.48, sx: 0.82, sy: 0.50, sz: 0.74 },
    { x:  0.10, y: 2.42, z:  0.60, sx: 0.80, sy: 0.50, sz: 0.72 },
    { x: -0.12, y: 2.44, z: -0.58, sx: 0.80, sy: 0.50, sz: 0.70 },
  ], [])

  return (
    <group position={position}>

      {/* ── Root flares at base ── */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.28, -0.18, Math.sin(angle) * 0.28]}
            rotation={[0, -angle, 0.45]}
            castShadow
          >
            <boxGeometry args={[0.10, 0.32, 0.22]} />
            <meshStandardMaterial color={C.wood} roughness={0.92} />
          </mesh>
        )
      })}

      {/* ── Main trunk — thick baobab style ── */}
      {/* Lower trunk — very wide */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.38, 0.90, 10]} />
        <meshStandardMaterial color={C.wood} roughness={0.92} />
      </mesh>
      {/* Mid trunk — starts tapering */}
      <mesh position={[0, 1.10, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.28, 0.55, 9]} />
        <meshStandardMaterial color={C.wood} roughness={0.92} />
      </mesh>
      {/* Upper trunk — narrows to canopy */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.20, 0.48, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.92} />
      </mesh>
      {/* Crown connector — small sphere where trunk meets leaves */}
      <mesh position={[0, 1.88, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color={C.wood} roughness={0.92} />
      </mesh>

      {/* ── Large leaf blobs ── */}
      {leafBlobs.map((l, i) => (
        <mesh
          key={i}
          position={[l.x, l.y, l.z]}
          scale={[l.sx, l.sy, l.sz]}
          castShadow
        >
          <sphereGeometry args={[0.38, 8, 6]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? C.islandTop : i % 4 === 1 ? C.island : i % 4 === 2 ? C.islandBot : C.island}
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
