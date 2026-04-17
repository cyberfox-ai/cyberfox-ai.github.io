import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ─── Color palette ─────────────────────────────────────────────────────────────
const C = {
  island:      '#cdc9de',
  islandDark:  '#b8b4cc',
  islandLight: '#e2dff0',
  wall:        '#d4d0e5',
  wallLight:   '#e8e4f5',
  wood:        '#7a5c38',
  woodDark:    '#5c4228',
  woodLight:   '#9a7a5a',
  screen1:     '#0d1117',
  termGreen:   '#39ff14',
  termCyan:    '#00e8ff',
  termOrange:  '#ff8c00',
  termPink:    '#ff4488',
  fire:        '#ff9900',
  fireYellow:  '#ffee00',
  lamp:        '#ffe4a0',
  stone:       '#b8b4c8',
  stoneDark:   '#9890b0',
  metal:       '#d0cce0',
  glass:       '#ddeeff',
}

export function useCameraFly() {
  const { camera } = useThree()
  const fly = (target, lookAt = [0, 0.5, 0], onComplete) => {
    gsap.to(camera.position, {
      x: target[0], y: target[1], z: target[2],
      duration: 1.4, ease: 'power3.inOut', onComplete,
    })
    gsap.to(camera, {
      duration: 1.4, ease: 'power3.inOut',
      onUpdate() { camera.lookAt(lookAt[0], lookAt[1], lookAt[2]) },
    })
  }
  const reset = () => fly([6, 4, 8], [0, 0.5, 0])
  return { fly, reset }
}

// ─── Island ────────────────────────────────────────────────────────────────────
function Island() {
  return (
    <group>
      <mesh position={[0, 0.0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.4, 3.5, 0.22, 48]} />
        <meshStandardMaterial color={C.islandLight} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[3.5, 3.0, 0.9, 48]} />
        <meshStandardMaterial color={C.island} roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.25, 0]} castShadow>
        <cylinderGeometry args={[3.0, 2.0, 0.6, 40]} />
        <meshStandardMaterial color={C.islandDark} roughness={0.9} />
      </mesh>
      <mesh position={[0, -1.85, 0]} castShadow>
        <cylinderGeometry args={[2.0, 1.1, 0.8, 32]} />
        <meshStandardMaterial color="#aea9c2" roughness={0.9} />
      </mesh>
      <mesh position={[0, -2.45, 0]} castShadow>
        <cylinderGeometry args={[1.1, 0.35, 0.7, 24]} />
        <meshStandardMaterial color="#a8a0be" roughness={0.9} />
      </mesh>
      <mesh position={[0, -2.92, 0]}>
        <coneGeometry args={[0.35, 0.5, 16]} />
        <meshStandardMaterial color="#9e98b8" roughness={0.9} />
      </mesh>

      {/* Stone path pavers */}
      {[
        [0, 1.6], [0, 2.1], [-0.6, 2.3], [0.5, 2.4], [-1.2, 2.0], [1.2, 1.9],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]} receiveShadow>
          <boxGeometry args={[0.5 + (i % 3) * 0.1, 0.07, 0.45 + (i % 2) * 0.12]} />
          <meshStandardMaterial color={C.stone} roughness={0.95} />
        </mesh>
      ))}

      {/* Pebbles */}
      {[[-2.5, 1.2], [2.4, 0.8], [-2.8, -0.3], [2.6, -1.0]].map(([x, z], i) => (
        <group key={i} position={[x, 0.05, z]}>
          {[0, 1, 2, 3].map(j => (
            <mesh key={j} position={[Math.cos(j * 1.5) * 0.12, 0, Math.sin(j * 1.5) * 0.12]}>
              <sphereGeometry args={[0.05 + j * 0.015, 6, 5]} />
              <meshStandardMaterial color={C.stoneDark} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Grass tufts */}
      {[[-2.2, 0.4], [2.0, 1.2], [-1.8, -1.5], [2.5, 0.0], [-0.8, 2.5], [1.5, 2.2]].map(([x, z], i) => (
        <group key={i} position={[x, 0.08, z]}>
          {[0, 1, 2].map(j => (
            <mesh key={j} position={[Math.cos(j * 2.1) * 0.06, 0.06, Math.sin(j * 2.1) * 0.06]}
              rotation={[0.3, j * 1.2, 0]}>
              <coneGeometry args={[0.025, 0.14, 4]} />
              <meshStandardMaterial color="#b8b8cc" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// ─── Building ──────────────────────────────────────────────────────────────────
function Building() {
  return (
    <group position={[0.2, 0.11, -0.3]}>
      {/* Walls */}
      <mesh position={[0, 0.9, -1.0]} castShadow>
        <boxGeometry args={[2.4, 1.8, 0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.7} />
      </mesh>
      <mesh position={[-1.1, 0.9, -0.1]} castShadow>
        <boxGeometry args={[0.12, 1.8, 1.8]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.7} />
      </mesh>
      <mesh position={[1.1, 0.9, -0.1]} castShadow>
        <boxGeometry args={[0.12, 1.8, 1.8]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.7} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 1.82, -0.1]}>
        <boxGeometry args={[2.36, 0.1, 1.82]} />
        <meshStandardMaterial color={C.wall} roughness={0.8} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, 0.03, -0.1]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 1.8]} />
        <meshStandardMaterial color={C.islandLight} roughness={0.85} />
      </mesh>

      {/* Window */}
      <mesh position={[-0.65, 1.1, -0.93]}>
        <boxGeometry args={[0.55, 0.55, 0.06]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.65, 1.1, -0.9]}>
        <boxGeometry args={[0.44, 0.44, 0.02]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} metalness={0.2} transparent opacity={0.65} />
      </mesh>
      <mesh position={[-0.65, 1.1, -0.88]}>
        <boxGeometry args={[0.44, 0.022, 0.022]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.5} />
      </mesh>
      <mesh position={[-0.65, 1.1, -0.88]}>
        <boxGeometry args={[0.022, 0.44, 0.022]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.5} />
      </mesh>

      {/* Bookshelf */}
      <mesh position={[-0.98, 1.0, -0.7]}>
        <boxGeometry args={[0.04, 1.0, 0.8]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      {[0.3, 0.65, 1.0].map((y, i) => (
        <mesh key={i} position={[-0.97, y, -0.7]}>
          <boxGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color={C.wood} roughness={0.8} />
        </mesh>
      ))}
      {/* Books */}
      {[
        [-0.93, 0.46, -0.85, 0.06, 0.28, 0.12, '#c85a5a'],
        [-0.93, 0.46, -0.70, 0.05, 0.25, 0.12, '#5a88c8'],
        [-0.93, 0.46, -0.57, 0.07, 0.30, 0.12, '#5ac87a'],
        [-0.93, 0.79, -0.88, 0.06, 0.26, 0.12, '#c8a85a'],
        [-0.93, 0.79, -0.72, 0.05, 0.22, 0.12, '#885ac8'],
      ].map(([x, y, z, w, h, d, col], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={col} roughness={0.8} />
        </mesh>
      ))}

      {/* Radio */}
      <mesh position={[-0.94, 1.14, -0.58]}>
        <boxGeometry args={[0.04, 0.18, 0.22]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} />
      </mesh>
      <mesh position={[-0.91, 1.14, -0.58]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.02, 12]} />
        <meshStandardMaterial color={C.stoneDark} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.95, 1.28, -0.64]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.005, 0.005, 0.2, 6]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Baseboard + crown */}
      <mesh position={[0, 0.1, -0.97]}>
        <boxGeometry args={[2.15, 0.1, 0.04]} />
        <meshStandardMaterial color={C.islandLight} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.75, -0.97]}>
        <boxGeometry args={[2.15, 0.08, 0.05]} />
        <meshStandardMaterial color={C.islandLight} roughness={0.6} />
      </mesh>
    </group>
  )
}

// ─── Desk ──────────────────────────────────────────────────────────────────────
function Desk({ onSelect }) {
  const scanRef = useRef()
  useFrame((state) => {
    if (scanRef.current) {
      scanRef.current.position.y = 0.86 + ((state.clock.elapsedTime * 0.35) % 0.38)
    }
  })

  return (
    <group position={[0.2, 0.11, -0.45]} onClick={(e) => { e.stopPropagation(); onSelect('projects') }}>
      {/* Desk top */}
      <mesh position={[0, 0.68, -0.1]} castShadow>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <meshStandardMaterial color={C.woodLight} roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.66, 0.36]}>
        <boxGeometry args={[1.8, 0.04, 0.04]} />
        <meshStandardMaterial color={C.wood} roughness={0.6} />
      </mesh>

      {/* Legs */}
      {[[-0.84, -0.27], [0.84, -0.27], [-0.84, 0.27], [0.84, 0.27]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z - 0.1]} castShadow>
          <boxGeometry args={[0.06, 0.66, 0.06]} />
          <meshStandardMaterial color={C.wood} roughness={0.7} />
        </mesh>
      ))}
      {[[-0.84, 0], [0.84, 0]].map(([x], i) => (
        <mesh key={i} position={[x, 0.38, -0.1]}>
          <boxGeometry args={[0.04, 0.5, 0.52]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.8} />
        </mesh>
      ))}

      {/* Drawer */}
      <mesh position={[0.0, 0.52, 0.05]}>
        <boxGeometry args={[0.7, 0.12, 0.42]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>

      {/* Main monitor */}
      <mesh position={[0.18, 1.04, -0.42]}>
        <boxGeometry args={[0.75, 0.5, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0.18, 1.04, -0.39]}>
        <boxGeometry args={[0.68, 0.43, 0.02]} />
        <meshStandardMaterial color={C.screen1} roughness={0.05} />
      </mesh>
      {/* Code lines */}
      {[0.16, 0.09, 0.02, -0.05, -0.12].map((dy, i) => (
        <mesh key={i} position={[0.18 + (i % 2) * 0.04 - 0.02, 1.04 + dy, -0.38]}>
          <boxGeometry args={[0.3 + (i % 3) * 0.07, 0.016, 0.005]} />
          <meshStandardMaterial
            color={[C.termGreen, C.termCyan, C.termOrange, C.termGreen, C.termPink][i]}
            emissive={[C.termGreen, C.termCyan, C.termOrange, C.termGreen, C.termPink][i]}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      <mesh ref={scanRef} position={[0.18, 0.97, -0.378]}>
        <boxGeometry args={[0.65, 0.007, 0.003]} />
        <meshStandardMaterial color={C.termCyan} emissive={C.termCyan} emissiveIntensity={2} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.18, 0.76, -0.42]}>
        <boxGeometry args={[0.06, 0.18, 0.06]} />
        <meshStandardMaterial color="#252535" roughness={0.4} />
      </mesh>
      <mesh position={[0.18, 0.69, -0.38]}>
        <boxGeometry args={[0.2, 0.035, 0.12]} />
        <meshStandardMaterial color="#252535" roughness={0.4} />
      </mesh>
      <pointLight position={[0.18, 1.04, -0.36]} intensity={0.7} color={C.termGreen} distance={1.1} decay={2} />

      {/* Secondary monitor */}
      <mesh position={[-0.52, 1.0, -0.36]} rotation={[0, 0.45, 0]}>
        <boxGeometry args={[0.55, 0.38, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[-0.52, 1.0, -0.33]} rotation={[0, 0.45, 0]}>
        <boxGeometry args={[0.49, 0.32, 0.02]} />
        <meshStandardMaterial color="#ff6b35" roughness={0.05} emissive="#ff4400" emissiveIntensity={0.25} />
      </mesh>
      {/* Angular logo */}
      <mesh position={[-0.52, 1.0, -0.32]} rotation={[0, 0.45, 0.78]}>
        <boxGeometry args={[0.12, 0.12, 0.015]} />
        <meshStandardMaterial color="#dd4411" emissive="#dd3300" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>
      <mesh position={[-0.52, 0.76, -0.3]}>
        <boxGeometry args={[0.05, 0.14, 0.05]} />
        <meshStandardMaterial color="#252535" roughness={0.4} />
      </mesh>
      <mesh position={[-0.52, 0.69, -0.28]}>
        <boxGeometry args={[0.16, 0.03, 0.1]} />
        <meshStandardMaterial color="#252535" roughness={0.4} />
      </mesh>
      <pointLight position={[-0.52, 1.0, -0.28]} intensity={0.4} color="#ff6b35" distance={0.9} decay={2} />

      {/* Keyboard */}
      <mesh position={[0.1, 0.71, 0.0]}>
        <boxGeometry args={[0.58, 0.025, 0.22]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} metalness={0.2} />
      </mesh>
      {[0, 1, 2, 3].map(row =>
        [0, 1, 2, 3, 4, 5, 6, 7].map(col => (
          <mesh key={`${row}-${col}`} position={[0.1 - 0.24 + col * 0.065, 0.726, -0.04 + row * 0.044]}>
            <boxGeometry args={[0.05, 0.01, 0.035]} />
            <meshStandardMaterial color={C.wallLight} roughness={0.6} />
          </mesh>
        ))
      )}

      {/* Mouse */}
      <mesh position={[0.72, 0.71, 0.06]}>
        <capsuleGeometry args={[0.04, 0.07, 4, 8]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Lamp */}
      <mesh position={[0.72, 0.71, -0.28]}>
        <cylinderGeometry args={[0.04, 0.05, 0.04, 10]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.72, 0.92, -0.28]}>
        <cylinderGeometry args={[0.016, 0.016, 0.42, 6]} />
        <meshStandardMaterial color={C.metal} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.68, 1.12, -0.36]} rotation={[0.35, -0.2, 0]}>
        <coneGeometry args={[0.1, 0.14, 10, 1, true]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.68, 1.05, -0.36]} intensity={2.0} color={C.lamp} distance={2} decay={2} />

      {/* Mug */}
      <mesh position={[0.62, 0.71, -0.15]}>
        <cylinderGeometry args={[0.055, 0.045, 0.1, 12]} />
        <meshStandardMaterial color={C.islandLight} roughness={0.5} />
      </mesh>
      <mesh position={[0.68, 0.72, -0.15]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.028, 0.008, 6, 12, Math.PI]} />
        <meshStandardMaterial color={C.islandLight} roughness={0.5} />
      </mesh>

      {/* Sticky notes */}
      {[[0.32, 0.72, 0.22, '#ffe87c', 0.3], [-0.08, 0.72, 0.24, '#c8f0a0', -0.2]].map(([x, y, z, col, ry], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, ry, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.004]} />
          <meshStandardMaterial color={col} roughness={0.8} />
        </mesh>
      ))}

      {/* Headphones */}
      <mesh position={[-0.78, 0.88, 0.08]} rotation={[0, 0, 0.8]}>
        <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color={C.stoneDark} roughness={0.5} metalness={0.2} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[-0.78 + s * 0.07, 0.76, 0.08]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
          <meshStandardMaterial color={C.stoneDark} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Chair ─────────────────────────────────────────────────────────────────────
function Chair() {
  return (
    <group position={[0.2, 0.28, 0.42]}>
      <mesh castShadow>
        <boxGeometry args={[0.52, 0.07, 0.52]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[0.48, 0.04, 0.48]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.40, -0.25]} castShadow>
        <boxGeometry args={[0.5, 0.65, 0.07]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.40, -0.22]}>
        <boxGeometry args={[0.44, 0.58, 0.04]} />
        <meshStandardMaterial color={C.wallLight} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.82, -0.25]}>
        <boxGeometry args={[0.28, 0.16, 0.07]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <group key={i} position={[s * 0.3, 0.2, -0.08]}>
          <mesh>
            <boxGeometry args={[0.06, 0.32, 0.06]} />
            <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0.06]}>
            <boxGeometry args={[0.1, 0.03, 0.22]} />
            <meshStandardMaterial color={C.stoneDark} roughness={0.8} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.4, 10]} />
        <meshStandardMaterial color={C.metal} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.44, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 5]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI * 2 / 5) * 0.26, -0.5,
          Math.sin(i * Math.PI * 2 / 5) * 0.26
        ]}>
          <sphereGeometry args={[0.035, 8, 6]} />
          <meshStandardMaterial color={C.stoneDark} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Tree ──────────────────────────────────────────────────────────────────────
function Tree() {
  return (
    <group position={[1.8, 0.12, -1.4]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.09, 0.14, 1.4, 10]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.95} />
      </mesh>
      {[0.2, 0.5, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y - 0.5, 0]}>
          <cylinderGeometry args={[0.094, 0.094, 0.04, 10]} />
          <meshStandardMaterial color={C.wood} roughness={0.95} />
        </mesh>
      ))}
      {[
        [0,    1.7,  0,    0.82, 7, 5],
        [-0.5, 1.45, 0.2,  0.65, 6, 5],
        [0.42, 1.35, -0.25, 0.58, 6, 5],
        [-0.22, 1.85, -0.35, 0.50, 5, 4],
        [0.35,  1.75, 0.38,  0.47, 5, 4],
        [-0.55, 1.15, -0.15, 0.46, 5, 4],
        [0.12,  1.15, 0.48,  0.43, 5, 4],
        [-0.1,  1.55, 0.55,  0.38, 5, 4],
        [0.5,   1.5,  0.2,   0.36, 5, 4],
      ].map(([x, y, z, r, ws, hs], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, ws, hs]} />
          <meshStandardMaterial color={C.island} roughness={1.0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ─── Street lantern ────────────────────────────────────────────────────────────
function Lantern() {
  return (
    <group position={[-1.6, 0.12, -0.7]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.038, 0.05, 1.3, 10]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.07, 10]} />
        <meshStandardMaterial color={C.metal} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, -0.66, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 10]} />
        <meshStandardMaterial color={C.stoneDark} roughness={0.8} />
      </mesh>
      <mesh position={[0.24, 0.58, 0]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.022, 0.022, 0.5, 8]} />
        <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.4} />
      </mesh>
      <group position={[0.44, 0.52, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.13, 0.1, 0.06, 6]} />
          <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <coneGeometry args={[0.1, 0.12, 4]} />
          <meshStandardMaterial color={C.metal} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.18, 0.25, 0.18]} />
          <meshStandardMaterial color={C.lamp} roughness={0.1} transparent opacity={0.55} emissive={C.lamp} emissiveIntensity={0.7} />
        </mesh>
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.09, 0, Math.sin(i * Math.PI / 2) * 0.09]}>
            <boxGeometry args={[0.016, 0.26, 0.016]} />
            <meshStandardMaterial color={C.stoneDark} roughness={0.5} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshStandardMaterial color={C.lamp} emissive={C.lamp} emissiveIntensity={3} />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={2.0} color={C.lamp} distance={3.5} decay={2} />
      </group>
    </group>
  )
}

// ─── Campfire ──────────────────────────────────────────────────────────────────
function Campfire() {
  const fire1 = useRef(), fire2 = useRef(), fire3 = useRef(), e1 = useRef(), e2 = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (fire1.current) {
      fire1.current.scale.y = 1 + Math.sin(t * 8) * 0.15
      fire1.current.scale.x = 1 + Math.sin(t * 6.5) * 0.1
      fire1.current.position.y = 0.2 + Math.sin(t * 7) * 0.015
    }
    if (fire2.current) {
      fire2.current.scale.y = 1 + Math.sin(t * 9 + 1) * 0.18
      fire2.current.scale.x = 1 + Math.sin(t * 7 + 0.5) * 0.12
    }
    if (fire3.current) {
      fire3.current.scale.y = 1 + Math.sin(t * 11 + 2) * 0.2
    }
    if (e1.current) {
      e1.current.position.y = 0.32 + Math.abs(Math.sin(t * 2.5)) * 0.18
      e1.current.position.x = Math.sin(t * 1.8) * 0.12
      if (e1.current.material) e1.current.material.opacity = 0.5 + Math.sin(t * 3) * 0.3
    }
    if (e2.current) {
      e2.current.position.y = 0.28 + Math.abs(Math.sin(t * 2.2 + 1)) * 0.15
      e2.current.position.x = Math.sin(t * 2.1 + 1) * 0.10
      if (e2.current.material) e2.current.material.opacity = 0.4 + Math.sin(t * 4) * 0.3
    }
  })
  return (
    <group position={[-0.05, 0.12, 1.0]}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <mesh key={i}
          position={[Math.cos(i * Math.PI / 3) * 0.13, 0.02, Math.sin(i * Math.PI / 3) * 0.13]}
          rotation={[0.2, i * Math.PI / 3, 0.3]}>
          <cylinderGeometry args={[0.028, 0.035, 0.32, 7]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.95} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 0.2, 0.02, Math.sin(i * Math.PI / 4) * 0.2]}>
          <sphereGeometry args={[0.04 + (i % 3) * 0.01, 6, 5]} />
          <meshStandardMaterial color={C.stoneDark} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 10]} />
        <meshStandardMaterial color="#2a2020" roughness={1} />
      </mesh>
      <mesh ref={fire1} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.12, 0.32, 8]} />
        <meshStandardMaterial color={C.fire} emissive={C.fire} emissiveIntensity={1.5} transparent opacity={0.88} />
      </mesh>
      <mesh ref={fire2} position={[0.04, 0.22, 0.02]}>
        <coneGeometry args={[0.07, 0.24, 7]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.8} transparent opacity={0.8} />
      </mesh>
      <mesh ref={fire3} position={[0, 0.25, 0]}>
        <coneGeometry args={[0.04, 0.2, 6]} />
        <meshStandardMaterial color={C.fireYellow} emissive={C.fireYellow} emissiveIntensity={2.5} transparent opacity={0.9} />
      </mesh>
      <mesh ref={e1} position={[0.08, 0.32, 0.06]}>
        <sphereGeometry args={[0.012, 4, 3]} />
        <meshStandardMaterial color={C.fireYellow} emissive={C.fireYellow} emissiveIntensity={3} transparent opacity={0.8} />
      </mesh>
      <mesh ref={e2} position={[-0.06, 0.28, -0.04]}>
        <sphereGeometry args={[0.009, 4, 3]} />
        <meshStandardMaterial color={C.fire} emissive={C.fire} emissiveIntensity={3} transparent opacity={0.7} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={3.0} color="#ff7700" distance={5} decay={2} />
      <pointLight position={[0, 0.15, 0]} intensity={1.5} color="#ff9900" distance={3} decay={2} />
    </group>
  )
}

// ─── Contact sign ──────────────────────────────────────────────────────────────
function ContactSign({ onSelect }) {
  return (
    <group position={[-2.1, 0.36, 0.3]} rotation={[0, 0.5, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect('contact') }}
      style={{ cursor: 'pointer' }}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.07, 0.6, 0.07]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.82, 0.28, 0.08]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.74, 0.2, 0.02]} />
        <meshStandardMaterial color="#2a0a05" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.07]}>
        <boxGeometry args={[0.55, 0.04, 0.01]} />
        <meshStandardMaterial color="#ff8855" emissive="#ff6633" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, -0.04, 0.07]}>
        <boxGeometry args={[0.38, 0.025, 0.01]} />
        <meshStandardMaterial color="#ff8855" emissive="#ff6633" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 0, 0.2]} intensity={0.5} color="#ff7744" distance={1.2} decay={2} />
    </group>
  )
}

// ─── Welcome sign ──────────────────────────────────────────────────────────────
function WelcomeSign({ onSelect }) {
  return (
    <group position={[-0.4, 0.14, 1.7]} rotation={[0, -0.2, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect('about') }}>
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={i} position={[x, -0.16, 0]}>
          <boxGeometry args={[0.055, 0.35, 0.055]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.85} />
        </mesh>
      ))}
      <mesh castShadow>
        <boxGeometry args={[1.05, 0.28, 0.07]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.98, 0.22, 0.02]} />
        <meshStandardMaterial color={C.woodLight} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.03, 0.06]}>
        <boxGeometry args={[0.65, 0.035, 0.01]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.6} />
      </mesh>
      <mesh position={[-0.05, -0.04, 0.06]}>
        <boxGeometry args={[0.45, 0.025, 0.01]} />
        <meshStandardMaterial color={C.wood} roughness={0.6} />
      </mesh>
    </group>
  )
}

// ─── Art easel ─────────────────────────────────────────────────────────────────
function Easel({ onSelect }) {
  return (
    <group position={[2.3, 0.12, 0.1]} rotation={[0, -0.6, 0]}
      onClick={(e) => { e.stopPropagation(); onSelect('skills') }}>
      <mesh position={[-0.2, 0.6, 0.12]} rotation={[0.25, 0, -0.08]}>
        <cylinderGeometry args={[0.022, 0.022, 1.3, 6]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.6, 0.12]} rotation={[0.25, 0, 0.08]}>
        <cylinderGeometry args={[0.022, 0.022, 1.3, 6]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, -0.18]} rotation={[-0.35, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.2, 6]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0.04]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.44, 6]} />
        <meshStandardMaterial color={C.wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.88, 0.08]} castShadow>
        <boxGeometry args={[0.62, 0.48, 0.05]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.88, 0.11]}>
        <boxGeometry args={[0.55, 0.41, 0.02]} />
        <meshStandardMaterial color="#0d1a0d" roughness={0.3} />
      </mesh>
      {[0.17, 0.09, 0.01, -0.07, -0.15].map((dy, i) => (
        <mesh key={i} position={[-0.06 + (i % 2) * 0.04, 0.88 + dy, 0.13]}>
          <boxGeometry args={[0.28 + (i % 3) * 0.06, 0.02, 0.005]} />
          <meshStandardMaterial
            color={[C.termGreen, '#7fff44', '#aaffaa', C.termGreen, C.termCyan][i]}
            emissive={[C.termGreen, '#7fff44', '#aaffaa', C.termGreen, C.termCyan][i]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.88, 0.12]}>
        <boxGeometry args={[0.18, 0.12, 0.005]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.2} />
      </mesh>
      <mesh position={[-0.06, 0.89, 0.13]}>
        <sphereGeometry args={[0.025, 6, 5]} />
        <meshStandardMaterial color="#88ff44" emissive="#44ff00" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 0.88, 0.15]} intensity={0.4} color={C.termGreen} distance={1} decay={2} />
    </group>
  )
}

// ─── Social tokens ─────────────────────────────────────────────────────────────
function SocialTokens() {
  return (
    <group>
      {[[0.5, 1.5, '#1a1a2e'], [0.0, 1.82, '#833ab4'], [0.95, 1.78, '#ff0000']].map(([x, z, col], i) => (
        <group key={i} position={[x, 0.1, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
            <meshStandardMaterial color={C.islandLight} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 12]} />
            <meshStandardMaterial color={col} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── Plants ────────────────────────────────────────────────────────────────────
function Plants() {
  return (
    <group>
      <group position={[-2.5, 0.12, -1.2]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.13, 0.18, 10]} />
          <meshStandardMaterial color={C.stoneDark} roughness={0.8} />
        </mesh>
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} position={[
            Math.cos(i * 1.57) * 0.1,
            0.18 + Math.abs(Math.sin(i * 1.2)) * 0.08,
            Math.sin(i * 1.57) * 0.1
          ]} rotation={[-0.6 + i * 0.2, i * 1.57, i * 0.3]}>
            <sphereGeometry args={[0.1, 5, 4]} />
            <meshStandardMaterial color={C.island} roughness={1.0} flatShading />
          </mesh>
        ))}
      </group>
      <group position={[2.8, 0.12, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.09, 0.14, 8]} />
          <meshStandardMaterial color={C.stone} roughness={0.8} />
        </mesh>
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[
            Math.cos(i * 2.09) * 0.07, 0.14, Math.sin(i * 2.09) * 0.07
          ]} rotation={[-0.5, i * 2.09, 0]}>
            <sphereGeometry args={[0.08, 5, 4]} />
            <meshStandardMaterial color={C.islandLight} roughness={1.0} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
function FloatingIslandScene({ onSelect }) {
  const groupRef = useRef()
  // Gentle floating only — auto-rotation is DISABLED
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.07
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
      <ContactSign onSelect={onSelect} />
      <WelcomeSign onSelect={onSelect} />
      <Easel onSelect={onSelect} />
      <SocialTokens />
      <Plants />
    </group>
  )
}

export default FloatingIslandScene
