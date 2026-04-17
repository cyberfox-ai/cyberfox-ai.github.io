import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Color palette (clay/ceramic aesthetic like reference) ──────────────────
const C = {
  island:    '#d4d0e8',
  islandTop: '#e8e4f4',
  islandBot: '#b8b4cc',
  wall:      '#dddaea',
  wallDark:  '#ccc8dc',
  roof:      '#c4c0d8',
  roofDark:  '#b0accc',
  wood:      '#c8bcd0',
  woodDark:  '#b4a8bc',
  floor:     '#e0dcee',
  window:    '#b8d4f0',
  screenG:   '#00ffaa',
  screenO:   '#ff6600',
  screenB:   '#4488ff',
  lamp:      '#ffe8a0',
  fire:      '#ff9900',
  fireInner: '#ffee44',
  green:     '#39ff14',
  glass:     '#ddeeff',
  social:    '#ccc8dc',
  socialHov: '#b8b4cc',
  iconDark:  '#8880a0',
}

// ── Island base ────────────────────────────────────────────────────────────
function Island() {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.6, 2.8, 0.9, 48]} />
        <meshStandardMaterial color={C.island} roughness={0.85} />
      </mesh>
      {/* Top flat surface */}
      <mesh position={[0, 0.26, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.12, 48]} />
        <meshStandardMaterial color={C.islandTop} roughness={0.7} />
      </mesh>
      {/* Lower taper 1 */}
      <mesh position={[0, -0.88, 0]}>
        <cylinderGeometry args={[2.8, 1.6, 0.7, 32]} />
        <meshStandardMaterial color={C.islandBot} roughness={0.9} />
      </mesh>
      {/* Lower taper 2 */}
      <mesh position={[0, -1.42, 0]}>
        <cylinderGeometry args={[1.6, 0.7, 0.6, 24]} />
        <meshStandardMaterial color="#a8a4c0" roughness={0.9} />
      </mesh>
      {/* Tip */}
      <mesh position={[0, -1.86, 0]}>
        <cylinderGeometry args={[0.7, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#9c98b8" roughness={0.9} />
      </mesh>
      {/* Cobblestone path rings */}
      {[0.8, 1.6, 2.4].map((r, i) => (
        <mesh key={i} position={[0, 0.33, 0]} rotation={[-Math.PI/2, 0, i * 0.5]}>
          <ringGeometry args={[r, r + 0.06, 48]} />
          <meshStandardMaterial color={C.wallDark} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ── House with proper roof ─────────────────────────────────────────────────
function House() {
  return (
    <group position={[0, 0.32, -0.4]}>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.08, 2.0]} />
        <meshStandardMaterial color={C.floor} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.9, -0.96]} castShadow>
        <boxGeometry args={[2.6, 1.8, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-1.25, 0.9, -0.06]} castShadow>
        <boxGeometry args={[0.1, 1.8, 1.8]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.7} />
      </mesh>
      {/* Right wall */}
      <mesh position={[1.25, 0.9, -0.06]} castShadow>
        <boxGeometry args={[0.1, 1.8, 1.8]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.7} />
      </mesh>
      {/* Front wall left section */}
      <mesh position={[-0.88, 0.9, 0.94]} castShadow>
        <boxGeometry args={[0.84, 1.8, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      {/* Front wall right section */}
      <mesh position={[0.88, 0.9, 0.94]} castShadow>
        <boxGeometry args={[0.84, 1.8, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      {/* Front wall above door */}
      <mesh position={[0, 1.55, 0.94]}>
        <boxGeometry args={[0.72, 0.26, 0.1]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 1.84, -0.06]}>
        <boxGeometry args={[2.6, 0.08, 1.8]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.8} />
      </mesh>

      {/* ── Roof ── */}
      {/* Main ridge beam */}
      <mesh position={[0, 2.55, -0.06]} castShadow>
        <boxGeometry args={[2.72, 0.1, 0.12]} />
        <meshStandardMaterial color={C.roofDark} roughness={0.6} />
      </mesh>
      {/* Left roof panel */}
      <mesh position={[-0.72, 2.22, -0.06]} rotation={[0, 0, Math.PI * 0.18]} castShadow>
        <boxGeometry args={[1.52, 0.08, 2.1]} />
        <meshStandardMaterial color={C.roof} roughness={0.65} />
      </mesh>
      {/* Right roof panel */}
      <mesh position={[0.72, 2.22, -0.06]} rotation={[0, 0, -Math.PI * 0.18]} castShadow>
        <boxGeometry args={[1.52, 0.08, 2.1]} />
        <meshStandardMaterial color={C.roof} roughness={0.65} />
      </mesh>
      {/* Roof overhang front */}
      <mesh position={[0, 2.18, 1.1]} rotation={[Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[2.72, 0.07, 0.4]} />
        <meshStandardMaterial color={C.roofDark} roughness={0.65} />
      </mesh>
      {/* Roof overhang back */}
      <mesh position={[0, 2.18, -1.2]} rotation={[-Math.PI * 0.08, 0, 0]}>
        <boxGeometry args={[2.72, 0.07, 0.4]} />
        <meshStandardMaterial color={C.roofDark} roughness={0.65} />
      </mesh>
      {/* Left gable */}
      <mesh position={[-1.3, 2.1, -0.06]}>
        <boxGeometry args={[0.08, 0.55, 1.8]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.7} />
      </mesh>
      {/* Right gable */}
      <mesh position={[1.3, 2.1, -0.06]}>
        <boxGeometry args={[0.08, 0.55, 1.8]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.7} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.7, 2.5, -0.6]} castShadow>
        <boxGeometry args={[0.28, 0.7, 0.28]} />
        <meshStandardMaterial color={C.roofDark} roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 2.88, -0.6]}>
        <boxGeometry args={[0.32, 0.06, 0.32]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.7} />
      </mesh>

      {/* ── Windows ── */}
      {/* Back wall window left */}
      <mesh position={[-0.65, 1.0, -0.91]}>
        <boxGeometry args={[0.5, 0.5, 0.08]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.65, 1.0, -0.88]}>
        <boxGeometry args={[0.03, 0.5, 0.02]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[-0.65, 1.0, -0.88]}>
        <boxGeometry args={[0.5, 0.03, 0.02]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      {/* Back wall window right */}
      <mesh position={[0.65, 1.0, -0.91]}>
        <boxGeometry args={[0.5, 0.5, 0.08]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.65, 1.0, -0.88]}>
        <boxGeometry args={[0.03, 0.5, 0.02]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.65, 1.0, -0.88]}>
        <boxGeometry args={[0.5, 0.03, 0.02]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      {/* Window sills */}
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.72, -0.92]}>
          <boxGeometry args={[0.58, 0.05, 0.12]} />
          <meshStandardMaterial color={C.wallDark} roughness={0.6} />
        </mesh>
      ))}

      {/* ── Door frame ── */}
      <mesh position={[0, 0.65, 0.96]}>
        <boxGeometry args={[0.72, 1.3, 0.08]} />
        <meshStandardMaterial color={C.wood} roughness={0.6} />
      </mesh>
      {/* Door panels */}
      <mesh position={[-0.17, 0.62, 0.97]}>
        <boxGeometry args={[0.28, 1.12, 0.05]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.6} />
      </mesh>
      <mesh position={[0.17, 0.62, 0.97]}>
        <boxGeometry args={[0.28, 1.12, 0.05]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.6} />
      </mesh>
      {/* Door knob */}
      <mesh position={[0.08, 0.62, 1.01]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#e8d4a0" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Steps */}
      <mesh position={[0, 0.1, 1.15]}>
        <boxGeometry args={[0.88, 0.12, 0.3]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.04, 1.36]}>
        <boxGeometry args={[0.78, 0.08, 0.2]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.8} />
      </mesh>

      {/* Interior warm glow */}
      <pointLight position={[0, 0.8, 0]} intensity={1.8} color="#ffe4a0" distance={3} decay={2} />
    </group>
  )
}

// ── Desk setup ─────────────────────────────────────────────────────────────
function Desk({ onSelect }) {
  return (
    <group position={[0, 0.32, -0.7]} onClick={(e) => { e.stopPropagation(); onSelect('projects') }}>
      {/* Desk surface */}
      <mesh position={[0, 0.72, -0.15]} castShadow>
        <boxGeometry args={[1.7, 0.07, 0.85]} />
        <meshStandardMaterial color={C.floor} roughness={0.5} />
      </mesh>
      {/* Desk legs */}
      {[[-0.78,-0.32],[ 0.78,-0.32],[-0.78, 0.28],[ 0.78, 0.28]].map(([x,z],i) => (
        <mesh key={i} position={[x, 0.38, z - 0.15]}>
          <boxGeometry args={[0.07, 0.7, 0.07]} />
          <meshStandardMaterial color={C.wall} roughness={0.7} />
        </mesh>
      ))}
      {/* Back shelf */}
      <mesh position={[0, 1.1, -0.44]}>
        <boxGeometry args={[1.5, 0.05, 0.06]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.6} />
      </mesh>

      {/* Main monitor */}
      <mesh position={[0.18, 1.05, -0.44]}>
        <boxGeometry args={[0.72, 0.48, 0.05]} />
        <meshStandardMaterial color="#18182e" roughness={0.2} />
      </mesh>
      <mesh position={[0.18, 1.05, -0.41]}>
        <boxGeometry args={[0.66, 0.42, 0.02]} />
        <meshStandardMaterial color={C.screenG} emissive={C.screenG} emissiveIntensity={0.55} roughness={0.1} />
      </mesh>
      {/* Code lines on main monitor */}
      {[0.08, 0.02, -0.04, -0.1].map((dy, i) => (
        <mesh key={i} position={[0.18, 1.05 + dy, -0.40]}>
          <boxGeometry args={[0.35 - i * 0.06, 0.018, 0.01]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh position={[0.18, 0.8, -0.44]}>
        <boxGeometry args={[0.07, 0.16, 0.07]} />
        <meshStandardMaterial color={C.wall} />
      </mesh>

      {/* Side monitor */}
      <mesh position={[-0.5, 1.02, -0.41]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.52, 0.38, 0.05]} />
        <meshStandardMaterial color="#18182e" roughness={0.2} />
      </mesh>
      <mesh position={[-0.5, 1.02, -0.38]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.46, 0.32, 0.02]} />
        <meshStandardMaterial color={C.screenO} emissive={C.screenO} emissiveIntensity={0.3} roughness={0.1} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0.12, 0.76, 0.02]}>
        <boxGeometry args={[0.58, 0.03, 0.24]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Keycap rows */}
      {[0, 0.07, 0.14].map((dz, i) => (
        <mesh key={i} position={[0.12, 0.78, 0.02 - dz]}>
          <boxGeometry args={[0.52, 0.01, 0.04]} />
          <meshStandardMaterial color={C.wallDark} roughness={0.5} />
        </mesh>
      ))}

      {/* Mouse */}
      <mesh position={[0.65, 0.76, 0.02]}>
        <capsuleGeometry args={[0.045, 0.09, 6, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>

      {/* Desk lamp */}
      <mesh position={[0.65, 0.76, -0.26]}>
        <cylinderGeometry args={[0.06, 0.07, 0.04, 12]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.65, 0.96, -0.26]}>
        <cylinderGeometry args={[0.015, 0.015, 0.38, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.4} />
      </mesh>
      {/* Lamp arm bend */}
      <mesh position={[0.65, 1.14, -0.32]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.22, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.4} />
      </mesh>
      {/* Lamp shade */}
      <mesh position={[0.65, 1.18, -0.44]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.12, 0.18, 10, 1, true]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.65, 1.1, -0.44]} intensity={1.4} color="#ffe8c0" distance={2.2} decay={2} />

      {/* Mug */}
      <mesh position={[-0.6, 0.79, 0.08]}>
        <cylinderGeometry args={[0.07, 0.06, 0.12, 14]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Mug handle */}
      <mesh position={[-0.52, 0.79, 0.08]} rotation={[0, 0, Math.PI/2]}>
        <torusGeometry args={[0.04, 0.01, 6, 12, Math.PI]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Books stack */}
      {[0, 0.04, 0.09].map((dy, i) => (
        <mesh key={i} position={[-0.58, 0.76 + dy, -0.36]}>
          <boxGeometry args={[0.14, 0.038, 0.2]} />
          <meshStandardMaterial color={i === 0 ? '#c4a0c8' : i === 1 ? '#a0b4d0' : '#b8c4a0'} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ── Chair ──────────────────────────────────────────────────────────────────
function Chair() {
  return (
    <group position={[0, 0.32, 0.36]}>
      <mesh castShadow>
        <boxGeometry args={[0.58, 0.08, 0.58]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.52, 0.06, 0.52]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, -0.26]}>
        <boxGeometry args={[0.52, 0.65, 0.08]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      {/* Back cushion */}
      <mesh position={[0, 0.38, -0.22]}>
        <boxGeometry args={[0.46, 0.54, 0.06]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.8} />
      </mesh>
      {/* Armrests */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.22, -0.08]}>
          <boxGeometry args={[0.06, 0.04, 0.38]} />
          <meshStandardMaterial color={C.wallDark} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.38, 8]} />
        <meshStandardMaterial color={C.wallDark} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 18]} />
        <meshStandardMaterial color={C.wallDark} metalness={0.3} />
      </mesh>
      {/* Wheels */}
      {[0,1,2,3,4].map(i => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a)*0.22, -0.48, Math.sin(a)*0.22]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color={C.roofDark} roughness={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

// ── Improved Tree ──────────────────────────────────────────────────────────
function Tree({ position = [2.1, 0.32, -1.4] }) {
  return (
    <group position={position}>
      {/* Root flare */}
      {[0,1,2,3].map(i => (
        <mesh key={i} position={[Math.cos(i*Math.PI/2)*0.18, -0.05, Math.sin(i*Math.PI/2)*0.18]} rotation={[0, i*Math.PI/2, 0.3]}>
          <boxGeometry args={[0.08, 0.18, 0.22]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.9} />
        </mesh>
      ))}
      {/* Trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.6, 10]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>
      {/* Branch 1 */}
      <mesh position={[-0.28, 0.8, 0.1]} rotation={[0.1, 0, 0.55]}>
        <cylinderGeometry args={[0.045, 0.07, 0.8, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>
      {/* Branch 2 */}
      <mesh position={[0.22, 0.95, -0.1]} rotation={[0.1, 0, -0.4]}>
        <cylinderGeometry args={[0.038, 0.06, 0.7, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>
      {/* Branch 3 back */}
      <mesh position={[0.0, 1.05, -0.24]} rotation={[-0.5, 0, 0.15]}>
        <cylinderGeometry args={[0.032, 0.055, 0.65, 8]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>

      {/* Leaf clusters — layered organic blobs */}
      {[
        [0,    2.0,  0,    0.78],
        [-0.5, 1.78, 0.2,  0.6],
        [0.42, 1.72, -0.18,0.56],
        [-0.22,2.18,-0.28, 0.5],
        [0.32, 2.12, 0.28, 0.46],
        [-0.55,1.48,-0.12, 0.44],
        [0.18, 1.42, 0.42, 0.42],
        [0.5,  1.85, 0.14, 0.38],
        [-0.18,1.92,-0.5,  0.38],
        [0.0,  2.38, 0.0,  0.34],
        [-0.35,2.3, 0.22,  0.3],
      ].map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]} castShadow>
          <sphereGeometry args={[r, 8, 6]} />
          <meshStandardMaterial color={i%2===0 ? C.island : C.islandTop} roughness={1.0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ── Small bush ────────────────────────────────────────────────────────────
function Bush({ position }) {
  return (
    <group position={position}>
      {[[0,0.12,0,0.24],[0.18,0.1,0.1,0.18],[-0.16,0.1,-0.08,0.18],[0.08,0.2,0,0.16]].map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]}>
          <sphereGeometry args={[r, 7, 5]} />
          <meshStandardMaterial color={C.islandTop} roughness={1.0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ── Improved Mailbox ───────────────────────────────────────────────────────
function Mailbox({ onSelect }) {
  return (
    <group position={[-2.2, 0.34, 0.5]} onClick={(e) => { e.stopPropagation(); onSelect('contact') }}>
      {/* Post */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Post cap */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.055, 0.04, 0.06, 8]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.6} />
      </mesh>
      {/* Box body */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <boxGeometry args={[0.26, 0.2, 0.36]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      {/* Rounded roof */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.36, 12, 1, false, 0, Math.PI]} rotation={[0, Math.PI/2, 0]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.5} />
      </mesh>
      {/* Mail slot */}
      <mesh position={[0, 0.68, 0.185]}>
        <boxGeometry args={[0.14, 0.03, 0.02]} />
        <meshStandardMaterial color={C.roofDark} roughness={0.4} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.14, 0.76, -0.1]}>
        <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.9, -0.04]}>
        <boxGeometry args={[0.003, 0.1, 0.14]} />
        <meshStandardMaterial color="#e08080" roughness={0.5} />
      </mesh>
      {/* Glow */}
      <pointLight position={[0, 0.8, 0]} intensity={0.5} color="#aaddff" distance={1.4} decay={2} />
    </group>
  )
}

// ── Street Lantern ─────────────────────────────────────────────────────────
function Lantern({ position = [-1.8, 0.34, -0.8] }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.055, 1.4, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.28, 0.6, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.56, 8]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {/* Lantern cage */}
      <mesh position={[0.54, 0.56, 0]}>
        <boxGeometry args={[0.2, 0.26, 0.2]} />
        <meshStandardMaterial color={C.wall} roughness={0.4} transparent opacity={0.7} />
      </mesh>
      {/* Lantern top */}
      <mesh position={[0.54, 0.7, 0]}>
        <coneGeometry args={[0.13, 0.1, 6]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.5} />
      </mesh>
      {/* Light bulb */}
      <mesh position={[0.54, 0.56, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={C.lamp} emissive={C.lamp} emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0.54, 0.56, 0]} intensity={1.8} color="#ffe4a0" distance={3.5} decay={2} />
    </group>
  )
}

// ── Campfire ───────────────────────────────────────────────────────────────
function Campfire({ position = [-0.2, 0.34, 1.1] }) {
  const fireRef = useRef()
  const fire2Ref = useRef()
  useFrame((s) => {
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(s.clock.elapsedTime * 8) * 0.14
      fireRef.current.scale.x = 1 + Math.sin(s.clock.elapsedTime * 6) * 0.09
    }
    if (fire2Ref.current) {
      fire2Ref.current.scale.y = 1 + Math.sin(s.clock.elapsedTime * 9 + 1) * 0.12
    }
  })
  return (
    <group position={position}>
      {/* Stone ring */}
      {[0,1,2,3,4,5].map(i => {
        const a = (i/6)*Math.PI*2
        return (
          <mesh key={i} position={[Math.cos(a)*0.2, 0.02, Math.sin(a)*0.2]}>
            <sphereGeometry args={[0.07, 6, 5]} />
            <meshStandardMaterial color={C.wallDark} roughness={0.9} />
          </mesh>
        )
      })}
      {/* Logs */}
      <mesh rotation={[0, 0.4, Math.PI/2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.38, 7]} />
        <meshStandardMaterial color={C.wood} roughness={0.9} />
      </mesh>
      <mesh rotation={[0, -0.4, Math.PI/2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.38, 7]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.9} />
      </mesh>
      {/* Embers */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={0.6} />
      </mesh>
      {/* Outer flame */}
      <mesh ref={fireRef} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.12, 0.34, 8]} />
        <meshStandardMaterial color={C.fire} emissive={C.fire} emissiveIntensity={1.4} transparent opacity={0.92} />
      </mesh>
      {/* Inner flame */}
      <mesh ref={fire2Ref} position={[0, 0.24, 0]}>
        <coneGeometry args={[0.065, 0.22, 8]} />
        <meshStandardMaterial color={C.fireInner} emissive={C.fireInner} emissiveIntensity={2.2} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0.35, 0]} intensity={2.8} color="#ff8800" distance={5} decay={2} />
    </group>
  )
}

// ── Social Media Icon Tiles on floor ──────────────────────────────────────
function SocialTile({ position, rotation = [0, 0, 0], label, color, symbol, onSelect }) {
  const tileRef = useRef()
  useFrame((s) => {
    if (tileRef.current) {
      tileRef.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 1.5 + position[0] * 3) * 0.015
    }
  })
  return (
    <group
      ref={tileRef}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onSelect && onSelect('contact') }}
    >
      {/* Tile base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 14]} />
        <meshStandardMaterial color={C.social} roughness={0.5} />
      </mesh>
      {/* Tile top face */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.02, 14]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Icon symbol (bar pattern for each platform) */}
      {symbol === 'x' && (
        <>
          <mesh position={[-0.055, 0.06, 0]} rotation={[0, 0, Math.PI/4]}>
            <boxGeometry args={[0.16, 0.025, 0.01]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
          <mesh position={[0.055, 0.06, 0]} rotation={[0, 0, -Math.PI/4]}>
            <boxGeometry args={[0.16, 0.025, 0.01]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
        </>
      )}
      {symbol === 'gh' && (
        <>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.01, 12]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.06, 0.07]}>
            <boxGeometry args={[0.05, 0.01, 0.06]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
        </>
      )}
      {symbol === 'li' && (
        <>
          <mesh position={[-0.04, 0.06, 0]}>
            <boxGeometry args={[0.025, 0.12, 0.01]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
          <mesh position={[0.04, 0.06, -0.02]}>
            <boxGeometry args={[0.025, 0.08, 0.01]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
          <mesh position={[0.04, 0.1, 0.02]} rotation={[Math.PI/2, 0, 0]}>
            <boxGeometry args={[0.025, 0.06, 0.01]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
        </>
      )}
      {symbol === 'ig' && (
        <>
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.065, 0.02, 8, 16]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
          <mesh position={[0.05, 0.06, 0]}>
            <sphereGeometry args={[0.016, 6, 6]} />
            <meshStandardMaterial color={C.iconDark} roughness={0.3} />
          </mesh>
        </>
      )}
      {/* Glow under tile */}
      <pointLight position={[0, -0.05, 0]} intensity={0.3} color={color} distance={0.6} decay={2} />
    </group>
  )
}

// ── Easel / Skills board ───────────────────────────────────────────────────
function SkillsEasel({ onSelect }) {
  return (
    <group position={[2.5, 0.34, 0.3]} rotation={[0, -0.55, 0]} onClick={(e) => { e.stopPropagation(); onSelect('skills') }}>
      {/* Legs */}
      <mesh rotation={[0.28, 0, 0]} position={[0, 0.55, 0.12]}>
        <boxGeometry args={[0.04, 1.1, 0.04]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      <mesh rotation={[-0.18, 0, 0]} position={[0, 0.5, -0.12]}>
        <boxGeometry args={[0.04, 0.98, 0.04]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      {/* Cross bar */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 6]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>
      {/* Canvas */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.66, 0.5, 0.04]} />
        <meshStandardMaterial color="#1a2e1a" roughness={0.3} />
      </mesh>
      {/* Skill bars */}
      {[0.15, 0.07, -0.01, -0.09, -0.17].map((dy, i) => (
        <group key={i} position={[0, 0.82 + dy, 0.025]}>
          <mesh position={[-(0.25 - (0.28+i*0.03)/2), 0, 0]}>
            <boxGeometry args={[0.28 + i * 0.03, 0.022, 0.01]} />
            <meshStandardMaterial color={C.green} emissive={C.green} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 0.82, 0.2]} intensity={0.5} color={C.green} distance={1.2} decay={2} />
    </group>
  )
}

// ── Welcome Sign ───────────────────────────────────────────────────────────
function WelcomeSign({ onSelect }) {
  return (
    <group position={[-0.3, 0.34, 1.8]} rotation={[0, -0.15, 0]} onClick={(e) => { e.stopPropagation(); onSelect('about') }}>
      {/* Main sign board */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.32, 0.07]} />
        <meshStandardMaterial color={C.wood} roughness={0.75} />
      </mesh>
      {/* Inset dark plate */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.02, 0.24, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} />
      </mesh>
      {/* "Welcome" text bars */}
      {[-0.04, 0.04].map((dy, i) => (
        <mesh key={i} position={[0, dy, 0.055]}>
          <boxGeometry args={[0.8, 0.026, 0.005]} />
          <meshStandardMaterial color={C.green} emissive={C.green} emissiveIntensity={1.6} />
        </mesh>
      ))}
      {/* Posts */}
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={i} position={[x, -0.26, 0]}>
          <boxGeometry args={[0.07, 0.24, 0.07]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.8} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0.4]} intensity={0.45} color={C.green} distance={1.1} decay={2} />
    </group>
  )
}

// ── Stepping stones path ──────────────────────────────────────────────────
function SteppingStones() {
  const stones = [
    [0.0,  1.4], [0.3,  1.8], [0.0,  2.2],
    [-0.4, 2.5], [0.4,  2.8], [-0.1, 3.1],
  ]
  return (
    <>
      {stones.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z - 1.5]}>
          <cylinderGeometry args={[0.16 - i*0.01, 0.16 - i*0.01, 0.04, 10]} />
          <meshStandardMaterial color={C.wallDark} roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

// ── Main scene ────────────────────────────────────────────────────────────
function FloatingIslandScene({ onSelect }) {
  const groupRef = useRef()

  useFrame((s) => {
    if (groupRef.current) {
      // Gentle float only — NO rotation
      groupRef.current.position.y = Math.sin(s.clock.elapsedTime * 0.55) * 0.07
    }
  })

  return (
    <group ref={groupRef}>
      <Island />
      <House />
      <Desk onSelect={onSelect} />
      <Chair />

      {/* Two trees */}
      <Tree position={[2.0, 0.32, -1.5]} />
      <Tree position={[-1.4, 0.32, -1.8]} />

      {/* Bushes */}
      <Bush position={[1.6, 0.34, 0.8]} />
      <Bush position={[-0.8, 0.34, 1.6]} />
      <Bush position={[2.6, 0.34, -0.4]} />

      <Lantern position={[-2.0, 0.34, -0.7]} />
      <Campfire position={[-0.2, 0.34, 1.1]} />
      <Mailbox onSelect={onSelect} />
      <WelcomeSign onSelect={onSelect} />
      <SkillsEasel onSelect={onSelect} />
      <SteppingStones />

      {/* Social tiles on floor */}
      <SocialTile position={[-0.55, 0.38, 0.75]} label="GitHub"   color="#9988cc" symbol="gh" onSelect={onSelect} />
      <SocialTile position={[ 0.12, 0.38, 0.92]} label="X"        color="#aaa8c0" symbol="x"  onSelect={onSelect} />
      <SocialTile position={[ 0.78, 0.38, 0.75]} label="LinkedIn" color="#88aacc" symbol="li" onSelect={onSelect} />
      <SocialTile position={[ 0.12, 0.38, 1.36]} label="Instagram"color="#ccaabb" symbol="ig" onSelect={onSelect} />
    </group>
  )
}

export default FloatingIslandScene
