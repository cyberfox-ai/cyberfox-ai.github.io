import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ── Palette ──────────────────────────────────────────────────
const C = {
  island:    '#ccc8dc', islandMid: '#b8b4cc', islandBot: '#a8a4bc',
  grass:     '#d4d0e4', wall:      '#dbd8ec', wallDark:  '#c8c4d8',
  roof:      '#c0bcd0', wood:      '#9b7b52', woodDark:  '#7a5e3a',
  screenBg:  '#0d1117', screenGlow:'#00ff88', screenRed: '#ff4455',
  fire:      '#ff7700', fireYellow:'#ffcc00', terminal:  '#39ff14',
  accent:    '#e8e4f8', stone:     '#b0acc8', glass:     '#c8e8ff',
  metal:     '#d0cce0', dark:      '#1a1a2e', lantern:   '#ffe4a0',
  leaf:      '#d8d4ec', leafMid:   '#c8c4dc',
}

// ── Camera fly helper ─────────────────────────────────────────
export function useCameraFly() {
  const { camera } = useThree()
  const fly = (target, lookAt = [0, 0.5, 0], onComplete) => {
    gsap.to(camera.position, { x: target[0], y: target[1], z: target[2], duration: 1.4, ease: 'power3.inOut', onComplete })
    gsap.to({}, { duration: 1.4, ease: 'power3.inOut', onUpdate() { camera.lookAt(lookAt[0], lookAt[1], lookAt[2]) } })
  }
  return { fly, reset: () => fly([6, 4, 8], [0, 0.5, 0]) }
}

// ── Island ────────────────────────────────────────────────────
function Island() {
  return (
    <group>
      <mesh position={[0,-0.12,0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.4,3.1,0.55,48]} />
        <meshStandardMaterial color={C.grass} roughness={0.88} metalness={0.02} />
      </mesh>
      <mesh position={[0,-0.38,0]}>
        <cylinderGeometry args={[3.1,2.7,0.28,48]} />
        <meshStandardMaterial color={C.island} roughness={0.9} />
      </mesh>
      <mesh position={[0,0.15,0]} receiveShadow>
        <cylinderGeometry args={[3.32,3.4,0.08,48]} />
        <meshStandardMaterial color={C.accent} roughness={0.75} />
      </mesh>
      <mesh position={[0,-0.82,0]}>
        <cylinderGeometry args={[2.7,1.9,0.9,40]} />
        <meshStandardMaterial color={C.islandMid} roughness={0.92} />
      </mesh>
      <mesh position={[0,-1.56,0]}>
        <cylinderGeometry args={[1.9,0.6,1.3,32]} />
        <meshStandardMaterial color={C.islandBot} roughness={0.93} />
      </mesh>
      <mesh position={[0,-2.28,0]}>
        <cylinderGeometry args={[0.6,0.1,0.6,20]} />
        <meshStandardMaterial color={C.islandBot} roughness={0.95} />
      </mesh>
      {[[2.4,0.2,0.8,0.18],[2.2,0.2,-1.4,0.14],[-2.6,0.2,0.3,0.16],[-1.8,0.2,2.0,0.13]].map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]} castShadow>
          <sphereGeometry args={[r,8,6]} />
          <meshStandardMaterial color={C.stone} roughness={0.95} />
        </mesh>
      ))}
      {[[-2.2,0.18,1.5],[2.8,0.18,-0.6],[-0.5,0.18,2.9],[1.8,0.18,2.4]].map(([x,y,z],i) => (
        <mesh key={i} position={[x,y,z]} rotation={[0,i*1.1,0]}>
          <coneGeometry args={[0.07,0.22,6]} />
          <meshStandardMaterial color={C.leafMid} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// ── Building ── click window → resume ────────────────────────
function Building({ onSelect }) {
  return (
    <group position={[0.15,0.3,-0.3]}>
      {/* Back wall */}
      <mesh position={[0,0.82,-0.92]} castShadow>
        <boxGeometry args={[2.3,1.68,0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.72} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-1.07,0.82,-0.18]} castShadow>
        <boxGeometry args={[0.12,1.68,1.55]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.72} />
      </mesh>
      {/* Right wall */}
      <mesh position={[1.07,0.82,-0.18]} castShadow>
        <boxGeometry args={[0.12,1.68,1.55]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.72} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0,1.68,-0.2]} castShadow>
        <boxGeometry args={[2.5,0.1,1.72]} />
        <meshStandardMaterial color={C.roof} roughness={0.65} />
      </mesh>
      {/* Floor */}
      <mesh position={[0,0.05,-0.2]} receiveShadow>
        <boxGeometry args={[2.3,0.1,1.55]} />
        <meshStandardMaterial color={C.accent} roughness={0.8} />
      </mesh>
      {/* Roof overhang */}
      <mesh position={[0,1.78,-0.2]}>
        <boxGeometry args={[2.6,0.05,1.85]} />
        <meshStandardMaterial color={C.accent} roughness={0.6} />
      </mesh>

      {/* ── WINDOW (clickable → Resume) ── */}
      <group
        position={[-0.55,1.08,-0.86]}
        onClick={e => { e.stopPropagation(); onSelect('resume') }}
      >
        {/* Window frame */}
        <mesh>
          <boxGeometry args={[0.58,0.58,0.06]} />
          <meshStandardMaterial color={C.wall} roughness={0.5} />
        </mesh>
        {/* Glass pane — glows on interaction */}
        <mesh position={[0,0,0.03]}>
          <boxGeometry args={[0.46,0.46,0.03]} />
          <meshStandardMaterial color={C.glass} roughness={0.05} metalness={0.4} transparent opacity={0.75} emissive={C.glass} emissiveIntensity={0.08} />
        </mesh>
        {/* Cross bars */}
        <mesh position={[0,0,0.05]}>
          <boxGeometry args={[0.46,0.04,0.02]} />
          <meshStandardMaterial color={C.wall} roughness={0.6} />
        </mesh>
        <mesh position={[0,0,0.05]}>
          <boxGeometry args={[0.04,0.46,0.02]} />
          <meshStandardMaterial color={C.wall} roughness={0.6} />
        </mesh>
        {/* Subtle glow hint */}
        <pointLight position={[0,0,0.4]} intensity={0.35} color="#c8e8ff" distance={1.2} decay={2} />
      </group>

      {/* Shelf + books */}
      <mesh position={[0.7,1.35,-0.87]}>
        <boxGeometry args={[0.32,0.06,0.18]} />
        <meshStandardMaterial color={C.accent} roughness={0.65} />
      </mesh>
      {[[0.56,C.screenGlow],[0.64,C.screenRed],[0.72,C.lantern]].map(([x,col]) => (
        <mesh key={x} position={[x,1.44,-0.87]}>
          <boxGeometry args={[0.07,0.16,0.14]} />
          <meshStandardMaterial color={col} roughness={0.6} emissive={col} emissiveIntensity={0.12} />
        </mesh>
      ))}
    </group>
  )
}

// ── Desk + dual monitors ── click main monitor → about ───────
function Desk({ onSelect }) {
  const lampRef = useRef()
  useFrame(s => { if (lampRef.current) lampRef.current.intensity = 1.1 + Math.sin(s.clock.elapsedTime * 2.5) * 0.05 })

  return (
    <group position={[0.2,0.3,-0.5]}>
      {/* Desk surface */}
      <mesh position={[0,0.67,-0.12]} castShadow>
        <boxGeometry args={[1.7,0.07,0.85]} />
        <meshStandardMaterial color={C.accent} roughness={0.48} metalness={0.05} />
      </mesh>
      {/* Drawer unit */}
      <mesh position={[0.6,0.35,-0.15]}>
        <boxGeometry args={[0.48,0.6,0.75]} />
        <meshStandardMaterial color={C.wall} roughness={0.6} />
      </mesh>
      {[0.15,-0.1].map((dy,i) => (
        <mesh key={i} position={[0.86,0.35+dy,-0.15]}>
          <boxGeometry args={[0.04,0.04,0.22]} />
          <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Legs */}
      {[[-0.75,-0.32],[0.75,-0.32],[-0.75,0.32],[0.75,0.32]].map(([x,z],i) => (
        <mesh key={i} position={[x,0.33,z-0.12]}>
          <boxGeometry args={[0.07,0.67,0.07]} />
          <meshStandardMaterial color={C.wallDark} roughness={0.7} />
        </mesh>
      ))}

      {/* ── MAIN MONITOR (clickable → About) ── */}
      <group
        position={[0.18,1.02,-0.4]}
        onClick={e => { e.stopPropagation(); onSelect('about') }}
      >
        <mesh>
          <boxGeometry args={[0.72,0.48,0.05]} />
          <meshStandardMaterial color={C.dark} roughness={0.2} />
        </mesh>
        {/* Screen */}
        <mesh position={[0,0,0.028]}>
          <boxGeometry args={[0.64,0.40,0.01]} />
          <meshStandardMaterial color={C.screenBg} roughness={0.1} emissive={C.screenGlow} emissiveIntensity={0.28} />
        </mesh>
        {/* Terminal lines */}
        {[0.1,0.04,-0.02,-0.08,-0.13].map((dy,i) => (
          <mesh key={i} position={[0.12-i*0.01,dy,-0.0]}>
            <boxGeometry args={[0.38-i*0.04,0.013,0.005]} />
            <meshStandardMaterial color={C.terminal} emissive={C.terminal} emissiveIntensity={1.3} />
          </mesh>
        ))}
        {/* Monitor stand */}
        <mesh position={[0,-0.28,0]}>
          <boxGeometry args={[0.07,0.16,0.06]} />
          <meshStandardMaterial color={C.wallDark} />
        </mesh>
        <mesh position={[0,-0.365,0.02]}>
          <boxGeometry args={[0.22,0.04,0.18]} />
          <meshStandardMaterial color={C.wallDark} />
        </mesh>
        <pointLight position={[0,0,0.35]} intensity={0.8} color={C.screenGlow} distance={1.8} decay={2} />
      </group>

      {/* Side monitor (decorative) */}
      <group position={[-0.52,0.98,-0.38]} rotation={[0,0.45,0]}>
        <mesh>
          <boxGeometry args={[0.52,0.36,0.05]} />
          <meshStandardMaterial color={C.dark} roughness={0.2} />
        </mesh>
        <mesh position={[0,0,0.03]}>
          <boxGeometry args={[0.44,0.28,0.01]} />
          <meshStandardMaterial color={C.screenBg} emissive={C.screenRed} emissiveIntensity={0.2} roughness={0.1} />
        </mesh>
        {[0.08,0.02,-0.04].map((dy,i) => (
          <mesh key={i} position={[0,dy,0.037]}>
            <boxGeometry args={[0.28-i*0.04,0.013,0.005]} />
            <meshStandardMaterial color={C.screenRed} emissive={C.screenRed} emissiveIntensity={0.9} />
          </mesh>
        ))}
        <pointLight position={[0,0,0.3]} intensity={0.45} color={C.screenRed} distance={1.2} decay={2} />
      </group>

      {/* Keyboard */}
      <mesh position={[0.1,0.71,0.04]}>
        <boxGeometry args={[0.6,0.025,0.22]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.55} />
      </mesh>
      {[0,1,2,3].map(row => [0,1,2,3,4,5,6,7,8,9].map(col => (
        <mesh key={`${row}-${col}`} position={[-0.15+col*0.065,0.727,0.04-row*0.045]}>
          <boxGeometry args={[0.055,0.006,0.038]} />
          <meshStandardMaterial color={C.accent} roughness={0.6} />
        </mesh>
      )))}

      {/* Mouse */}
      <mesh position={[0.72,0.70,0.04]}>
        <capsuleGeometry args={[0.045,0.075,4,8]} />
        <meshStandardMaterial color={C.wall} roughness={0.4} />
      </mesh>

      {/* Lamp */}
      <mesh position={[0.72,0.69,-0.3]}>
        <cylinderGeometry args={[0.07,0.09,0.04,12]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.72,0.88,-0.3]}>
        <cylinderGeometry args={[0.016,0.016,0.36,8]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.72,1.08,-0.33]} rotation={[0.4,0,0]}>
        <cylinderGeometry args={[0.012,0.012,0.28,8]} />
        <meshStandardMaterial color={C.wall} roughness={0.5} />
      </mesh>
      <mesh position={[0.72,1.12,-0.42]} rotation={[Math.PI,0,0]}>
        <coneGeometry args={[0.1,0.14,10,1,true]} />
        <meshStandardMaterial color={C.accent} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <pointLight ref={lampRef} position={[0.72,1.0,-0.4]} intensity={1.1} color={C.lantern} distance={2.2} decay={2} />

      {/* Mug */}
      <mesh position={[-0.6,0.72,-0.28]}>
        <cylinderGeometry args={[0.063,0.055,0.11,12]} />
        <meshStandardMaterial color={C.accent} roughness={0.5} />
      </mesh>
      <mesh position={[-0.6,0.782,-0.28]}>
        <cylinderGeometry args={[0.058,0.058,0.003,12]} />
        <meshStandardMaterial color="#3a2010" roughness={0.4} />
      </mesh>

      {/* Name plate */}
      <mesh position={[0,0.645,0.3]}>
        <boxGeometry args={[0.5,0.08,0.04]} />
        <meshStandardMaterial color={C.wood} roughness={0.7} />
      </mesh>
    </group>
  )
}

// ── Chair ─────────────────────────────────────────────────────
function Chair() {
  return (
    <group position={[0.2,0.28,0.38]}>
      <mesh castShadow><boxGeometry args={[0.56,0.07,0.56]} /><meshStandardMaterial color={C.wall} roughness={0.68} /></mesh>
      <mesh position={[0,0.05,0]}><boxGeometry args={[0.5,0.05,0.5]} /><meshStandardMaterial color={C.accent} roughness={0.75} /></mesh>
      <mesh position={[0,0.4,-0.26]}><boxGeometry args={[0.52,0.62,0.07]} /><meshStandardMaterial color={C.wall} roughness={0.68} /></mesh>
      <mesh position={[0,0.4,-0.22]}><boxGeometry args={[0.45,0.55,0.04]} /><meshStandardMaterial color={C.accent} roughness={0.75} /></mesh>
      {[-0.28,0.28].map((x,i) => (
        <group key={i}>
          <mesh position={[x,0.22,0]}><boxGeometry args={[0.05,0.3,0.05]} /><meshStandardMaterial color={C.wallDark} roughness={0.7} /></mesh>
          <mesh position={[x,0.38,0.08]}><boxGeometry args={[0.05,0.05,0.35]} /><meshStandardMaterial color={C.stone} roughness={0.4} /></mesh>
        </group>
      ))}
      <mesh position={[0,-0.18,0]}><cylinderGeometry args={[0.04,0.04,0.34,8]} /><meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0,-0.36,0]}><cylinderGeometry args={[0.28,0.28,0.04,5]} /><meshStandardMaterial color={C.wallDark} roughness={0.6} /></mesh>
      {[0,1,2,3,4].map(i => {
        const a = (i/5)*Math.PI*2
        return <mesh key={i} position={[Math.cos(a)*0.26,-0.4,Math.sin(a)*0.26]}><sphereGeometry args={[0.04,8,6]} /><meshStandardMaterial color={C.dark} roughness={0.8} /></mesh>
      })}
    </group>
  )
}

// ── Tree ──────────────────────────────────────────────────────
function Tree() {
  const clusters = useMemo(() => [
    [0,1.6,0,0.72],[-0.42,1.38,0.24,0.56],[0.38,1.28,-0.22,0.52],
    [-0.22,1.78,-0.32,0.47],[0.32,1.68,0.34,0.44],[-0.52,1.08,-0.12,0.42],
    [0.12,1.12,0.46,0.4],[0.5,1.5,0.18,0.38],[-0.18,1.22,0.5,0.35],
  ], [])
  return (
    <group position={[1.85,0.28,-1.25]}>
      <mesh castShadow><cylinderGeometry args={[0.1,0.15,1.25,10]} /><meshStandardMaterial color={C.wood} roughness={0.92} /></mesh>
      {[0.2,0.5,0.8].map((y,i) => (
        <mesh key={i} position={[0,y,0]}>
          <torusGeometry args={[0.115-y*0.02,0.012,4,12]} />
          <meshStandardMaterial color={C.woodDark} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[-0.25,0.72,0.1]} rotation={[0.2,0,0.55]} castShadow>
        <cylinderGeometry args={[0.04,0.07,0.72,8]} />
        <meshStandardMaterial color={C.wood} roughness={0.92} />
      </mesh>
      {[0,1,2,3].map(i => {
        const a=(i/4)*Math.PI*2
        return <mesh key={i} position={[Math.cos(a)*0.14,-0.55,Math.sin(a)*0.14]} rotation={[0,a,0.4]}><boxGeometry args={[0.06,0.08,0.22]} /><meshStandardMaterial color={C.woodDark} roughness={0.95} /></mesh>
      })}
      {clusters.map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]} castShadow>
          <sphereGeometry args={[r,8,6]} />
          <meshStandardMaterial color={i%3===0?C.leaf:i%3===1?C.leafMid:C.island} roughness={1.0} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ── Lantern ───────────────────────────────────────────────────
function Lantern() {
  const glowRef = useRef()
  useFrame(s => { if (glowRef.current) glowRef.current.intensity = 1.4 + Math.sin(s.clock.elapsedTime * 3) * 0.18 })
  return (
    <group position={[-1.55,0.28,-0.65]}>
      <mesh castShadow><cylinderGeometry args={[0.07,0.09,0.1,8]} /><meshStandardMaterial color={C.stone} roughness={0.7} /></mesh>
      <mesh position={[0,0.62,0]} castShadow><cylinderGeometry args={[0.04,0.04,1.14,8]} /><meshStandardMaterial color={C.wall} roughness={0.6} /></mesh>
      <mesh position={[0.24,1.12,0]} rotation={[0,0,-0.3]}><cylinderGeometry args={[0.025,0.025,0.48,8]} /><meshStandardMaterial color={C.wall} roughness={0.6} /></mesh>
      <mesh position={[0.46,1.08,0]}><boxGeometry args={[0.22,0.28,0.22]} /><meshStandardMaterial color={C.wall} roughness={0.45} transparent opacity={0.85} /></mesh>
      <mesh position={[0.46,1.24,0]}><boxGeometry args={[0.24,0.06,0.24]} /><meshStandardMaterial color={C.roof} roughness={0.5} /></mesh>
      <mesh position={[0.46,0.93,0]}><boxGeometry args={[0.24,0.04,0.24]} /><meshStandardMaterial color={C.roof} roughness={0.5} /></mesh>
      {[0,1,2,3].map(i => {
        const a=(i/4)*Math.PI*2, r=0.115
        return (
          <mesh key={i} position={[0.46+Math.cos(a)*r,1.08,Math.sin(a)*r]} rotation={[0,a,0]}>
            <boxGeometry args={[0.21,0.22,0.01]} />
            <meshStandardMaterial color={C.lantern} transparent opacity={0.35} emissive={C.lantern} emissiveIntensity={0.4} />
          </mesh>
        )
      })}
      <pointLight ref={glowRef} position={[0.46,1.08,0]} intensity={1.4} color={C.lantern} distance={3.5} decay={2} />
    </group>
  )
}

// ── Campfire ──────────────────────────────────────────────────
function Campfire() {
  const f1=useRef(), f2=useRef(), f3=useRef(), fl=useRef()
  useFrame(s => {
    const t=s.clock.elapsedTime
    if(f1.current){f1.current.scale.y=1+Math.sin(t*6.2)*0.14;f1.current.scale.x=1+Math.sin(t*7.5)*0.09}
    if(f2.current){f2.current.scale.y=1+Math.sin(t*8+1)*0.18;f2.current.scale.x=1+Math.sin(t*5.5+.5)*0.12}
    if(f3.current){f3.current.scale.y=1+Math.sin(t*9+2)*0.22;f3.current.scale.x=1+Math.sin(t*6+1.2)*0.1}
    if(fl.current)fl.current.intensity=2.4+Math.sin(t*7)*0.5
  })
  return (
    <group position={[-0.12,0.28,0.95]}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a=(i/8)*Math.PI*2
        return <mesh key={i} position={[Math.cos(a)*0.2,-0.02,Math.sin(a)*0.2]}><sphereGeometry args={[0.065,6,5]} /><meshStandardMaterial color={C.stone} roughness={0.95} /></mesh>
      })}
      <mesh rotation={[0,0.5,Math.PI/2]} position={[0,0.04,0]}><cylinderGeometry args={[0.045,0.045,0.38,8]} /><meshStandardMaterial color={C.woodDark} roughness={0.92} /></mesh>
      <mesh rotation={[0,-0.5,Math.PI/2]} position={[0,0.04,0]}><cylinderGeometry args={[0.045,0.045,0.38,8]} /><meshStandardMaterial color={C.wood} roughness={0.92} /></mesh>
      <mesh position={[0,0.06,0]}><cylinderGeometry args={[0.1,0.12,0.04,10]} /><meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={1.5} roughness={0.9} /></mesh>
      <mesh ref={f1} position={[0,0.22,0]}><coneGeometry args={[0.11,0.32,9]} /><meshStandardMaterial color={C.fire} emissive={C.fire} emissiveIntensity={1.3} transparent opacity={0.88} /></mesh>
      <mesh ref={f2} position={[0,0.26,0]}><coneGeometry args={[0.07,0.22,8]} /><meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1.6} transparent opacity={0.82} /></mesh>
      <mesh ref={f3} position={[0,0.3,0]}><coneGeometry args={[0.035,0.14,7]} /><meshStandardMaterial color={C.fireYellow} emissive={C.fireYellow} emissiveIntensity={2.5} transparent opacity={0.75} /></mesh>
      <pointLight ref={fl} position={[0,0.35,0]} intensity={2.4} color="#ff8800" distance={5} decay={2} />
    </group>
  )
}

// ── Mailbox ── click → contact ────────────────────────────────
function Mailbox({ onSelect }) {
  return (
    <group
      position={[-2.05,0.28,0.45]}
      onClick={e => { e.stopPropagation(); onSelect('contact') }}
    >
      <mesh position={[0,0.22,0]} castShadow><boxGeometry args={[0.06,0.46,0.06]} /><meshStandardMaterial color={C.wallDark} roughness={0.7} /></mesh>
      <mesh position={[0,0,0]}><boxGeometry args={[0.15,0.04,0.15]} /><meshStandardMaterial color={C.stone} roughness={0.75} /></mesh>
      <mesh position={[0,0.48,0]}><boxGeometry args={[0.24,0.2,0.32]} /><meshStandardMaterial color={C.wall} roughness={0.58} /></mesh>
      <mesh position={[0,0.59,0]}>
        <cylinderGeometry args={[0.12,0.12,0.32,10,1,false,0,Math.PI]} />
        <meshStandardMaterial color={C.accent} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.125,0.48,0]}><boxGeometry args={[0.01,0.03,0.14]} /><meshStandardMaterial color={C.dark} /></mesh>
      {/* Flag */}
      <mesh position={[-0.12,0.56,0.14]}><boxGeometry args={[0.015,0.12,0.015]} /><meshStandardMaterial color={C.wallDark} /></mesh>
      <mesh position={[-0.12,0.62,0.14]}><boxGeometry args={[0.015,0.06,0.05]} /><meshStandardMaterial color={C.screenRed} emissive={C.screenRed} emissiveIntensity={0.3} /></mesh>
      <pointLight position={[0,0.55,0]} intensity={0.55} color="#aaddff" distance={2} decay={2} />
    </group>
  )
}

// ── Welcome Sign ── click → (removed, monitor is about now) ──
function WelcomeSign() {
  return (
    <group position={[-0.5,0.32,1.55]} rotation={[0,-0.2,0]}>
      {[-0.4,0.4].map((x,i) => (
        <mesh key={i} position={[x,-0.22,0]}><boxGeometry args={[0.06,0.26,0.06]} /><meshStandardMaterial color={C.wood} roughness={0.82} /></mesh>
      ))}
      <mesh castShadow><boxGeometry args={[1.04,0.32,0.07]} /><meshStandardMaterial color={C.wood} roughness={0.78} /></mesh>
      <mesh position={[0,0,0.042]}><boxGeometry args={[0.96,0.24,0.01]} /><meshStandardMaterial color={C.dark} roughness={0.3} /></mesh>
      {[-0.04,0.04].map((dy,i) => (
        <mesh key={i} position={[0,dy,0.052]}><boxGeometry args={[0.72,0.025,0.005]} /><meshStandardMaterial color={C.terminal} emissive={C.terminal} emissiveIntensity={1.6} /></mesh>
      ))}
      {[-0.32,0.32].map((x,i) => (
        <mesh key={i} position={[x,0,0.052]}><boxGeometry args={[0.04,0.04,0.005]} /><meshStandardMaterial color={C.terminal} emissive={C.terminal} emissiveIntensity={1.2} /></mesh>
      ))}
      <pointLight position={[0,0.1,0.3]} intensity={0.35} color={C.terminal} distance={1.2} decay={2} />
    </group>
  )
}

// ── Easel / Canvas Board ── click → blog ─────────────────────
function ProjectCanvas({ onSelect }) {
  return (
    <group
      position={[2.25,0.28,0.22]} rotation={[0,-0.65,0]}
      onClick={e => { e.stopPropagation(); onSelect('blog') }}
    >
      {[[0,-0.08,0.14],[0,-0.08,-0.14],[0,-0.08,0]].map(([x,y,z],i) => (
        <mesh key={i} position={[x,0.45+y,z]} rotation={[i===2?-0.25:0.22,0,0]}>
          <boxGeometry args={[0.04,1.0,0.04]} />
          <meshStandardMaterial color={C.wood} roughness={0.82} />
        </mesh>
      ))}
      <mesh position={[0,0.48,0]}><boxGeometry args={[0.04,0.04,0.4]} /><meshStandardMaterial color={C.wood} roughness={0.82} /></mesh>
      {/* Canvas frame */}
      <mesh position={[0,0.82,0]}>
        <boxGeometry args={[0.64,0.5,0.06]} />
        <meshStandardMaterial color={C.dark} roughness={0.25} />
      </mesh>
      {/* Canvas screen */}
      <mesh position={[0,0.82,0.04]}>
        <boxGeometry args={[0.56,0.42,0.01]} />
        <meshStandardMaterial color="#0d1b0d" emissive={C.screenGlow} emissiveIntensity={0.15} roughness={0.2} />
      </mesh>
      {/* Blog lines */}
      {[0.16,0.08,0,-0.08,-0.14].map((dy,i) => (
        <mesh key={i} position={[-0.04+i*0.01,0.82+dy,0.052]}>
          <boxGeometry args={[0.28+i*0.04,0.022,0.005]} />
          <meshStandardMaterial color={C.terminal} emissive={C.terminal} emissiveIntensity={0.65} />
        </mesh>
      ))}
      <pointLight position={[0,0.82,0.25]} intensity={0.5} color={C.terminal} distance={1.4} decay={2} />
    </group>
  )
}

// ── Gaming TV Setup ─── (decorative/projects) ─────────────────
function GamingSetup({ onSelect }) {
  return (
    <group position={[2.55,0.28,0.7]} rotation={[0,-1.1,0]}
      onClick={e => { e.stopPropagation(); onSelect('about') }}>
      <mesh position={[0,0.15,0]}><boxGeometry args={[0.55,0.32,0.4]} /><meshStandardMaterial color={C.wall} roughness={0.65} /></mesh>
      <mesh position={[0,0.62,0]} castShadow><boxGeometry args={[0.68,0.42,0.07]} /><meshStandardMaterial color={C.dark} roughness={0.25} /></mesh>
      <mesh position={[0,0.63,0.04]}><boxGeometry args={[0.60,0.34,0.01]} /><meshStandardMaterial color="#0a1a0a" emissive="#44cc44" emissiveIntensity={0.28} roughness={0.1} /></mesh>
      {[0.1,0.04,-0.02,-0.08].map((dy,i) => (
        <mesh key={i} position={[-0.05+i*0.01,0.63+dy,0.052]}><boxGeometry args={[0.35-i*0.04,0.016,0.005]} /><meshStandardMaterial color="#66ff66" emissive="#66ff66" emissiveIntensity={0.7} /></mesh>
      ))}
      <mesh position={[0,0.32,0.22]}><capsuleGeometry args={[0.07,0.1,4,8]} /><meshStandardMaterial color={C.wallDark} roughness={0.6} /></mesh>
      <pointLight position={[0,0.65,0.25]} intensity={0.55} color="#44cc44" distance={1.5} decay={2} />
    </group>
  )
}

// ── Social Pads ── click → social links ──────────────────────
function SocialPads({ onSelect }) {
  const pads = [
    { pos:[0.42,0.2,1.65], icon:'X',  rot:0   },
    { pos:[0.96,0.2,1.44], icon:'P',  rot:0.2 },
    { pos:[0.68,0.2,1.95], icon:'IG', rot:-0.15 },
  ]
  return (
    <group>
      {pads.map((p,i) => (
        <group
          key={i}
          position={p.pos}
          rotation={[0,p.rot,0]}
          onClick={e => { e.stopPropagation(); onSelect('social') }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.16,0.16,0.07,16]} />
            <meshStandardMaterial color={C.wall} roughness={0.7} />
          </mesh>
          <mesh position={[0,0.042,0]}>
            <cylinderGeometry args={[0.13,0.13,0.02,16]} />
            <meshStandardMaterial color={C.dark} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Plant ─────────────────────────────────────────────────────
function Plant() {
  return (
    <group position={[-2.3,0.28,-0.9]}>
      <mesh castShadow><cylinderGeometry args={[0.1,0.07,0.16,10]} /><meshStandardMaterial color={C.stone} roughness={0.72} /></mesh>
      <mesh position={[0,0.09,0]}><cylinderGeometry args={[0.096,0.096,0.03,10]} /><meshStandardMaterial color="#3a2810" roughness={0.95} /></mesh>
      <mesh position={[0,0.24,0]}><cylinderGeometry args={[0.016,0.016,0.22,6]} /><meshStandardMaterial color="#5a8a2a" roughness={0.85} /></mesh>
      {[[0,0.35,0,0.14],[0.08,0.32,0.06,0.11],[-0.08,0.34,-0.05,0.1],[0.04,0.38,-0.07,0.09]].map(([x,y,z,r],i) => (
        <mesh key={i} position={[x,y,z]}><sphereGeometry args={[r,7,6]} /><meshStandardMaterial color={C.leafMid} roughness={0.9} flatShading /></mesh>
      ))}
    </group>
  )
}

// ── Fence ─────────────────────────────────────────────────────
function FencePosts() {
  const posts=[[-2.8,0.28,1.2],[-3.0,0.28,0.4],[-3.1,0.28,-0.4],[-2.9,0.28,-1.1]]
  return (
    <group>
      {posts.map(([x,y,z],i) => (
        <group key={i} position={[x,y,z]}>
          <mesh castShadow><boxGeometry args={[0.07,0.4,0.07]} /><meshStandardMaterial color={C.wallDark} roughness={0.75} /></mesh>
          <mesh position={[0,0.22,0]}><coneGeometry args={[0.055,0.08,4]} /><meshStandardMaterial color={C.wall} roughness={0.7} /></mesh>
        </group>
      ))}
      {posts.slice(0,-1).map(([x,y,z],j) => {
        const [nx,,nz]=posts[j+1], mx=(x+nx)/2, mz=(z+nz)/2
        const len=Math.sqrt((nx-x)**2+(nz-z)**2), angle=Math.atan2(nz-z,nx-x)
        return [0.05,0.14].map((dy,ri) => (
          <mesh key={`${j}-${ri}`} position={[mx,y+dy,mz]} rotation={[0,-angle,0]}>
            <boxGeometry args={[len,0.03,0.03]} />
            <meshStandardMaterial color={C.wall} roughness={0.72} />
          </mesh>
        ))
      })}
    </group>
  )
}

// ── Main Scene ────────────────────────────────────────────────
function FloatingIslandScene({ onSelect }) {
  const groupRef = useRef()

  // Gentle float — NO auto-rotation
  useFrame(state => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.07
    }
  })

  return (
    <group ref={groupRef}>
      <Island />
      <Building onSelect={onSelect} />
      <Desk     onSelect={onSelect} />
      <Chair />
      <Tree />
      <Lantern />
      <Campfire />
      <Mailbox       onSelect={onSelect} />
      <WelcomeSign />
      <ProjectCanvas onSelect={onSelect} />
      <GamingSetup   onSelect={onSelect} />
      <SocialPads    onSelect={onSelect} />
      <Plant />
      <FencePosts />
    </group>
  )
}

export default FloatingIslandScene
