import { useState, useEffect } from 'react'
import { PERSON, SKILLS, PROJECTS, SOCIALS, ABOUT } from '../content.js'

const PANELS = {
  about: {
    title: 'About Me',
    icon: '◈',
  },
  projects: {
    title: 'Projects',
    icon: '⌨',
  },
  skills: {
    title: 'Skills',
    icon: '◉',
  },
  contact: {
    title: 'Contact',
    icon: '✉',
  },
}

function SocialIcon({ type }) {
  if (type === 'gh') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
  if (type === 'li') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
  return <span style={{fontSize:16}}>✉</span>
}

function PanelContent({ type }) {
  if (type === 'about') return (
    <div>
      <p style={{color:'rgba(255,255,255,0.8)', lineHeight:1.7, marginBottom:20, fontSize:14}}>{ABOUT}</p>
      <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
        {['Offensive Security','Vulnerability Research','CTF Player','Bug Hunter'].map(tag => (
          <span key={tag} style={{
            padding:'4px 10px', borderRadius:20,
            background:'rgba(57,255,20,0.12)',
            border:'1px solid rgba(57,255,20,0.3)',
            color:'#39ff14', fontSize:12
          }}>{tag}</span>
        ))}
      </div>
    </div>
  )

  if (type === 'projects') return (
    <div style={{display:'flex', flexDirection:'column', gap:12}}>
      {PROJECTS.map(p => (
        <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer"
          style={{
            display:'block', textDecoration:'none',
            padding:'14px 16px', borderRadius:10,
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)',
            transition:'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(57,255,20,0.4)'; e.currentTarget.style.background='rgba(57,255,20,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
        >
          <div style={{color:'white', fontWeight:500, marginBottom:4, fontSize:14}}>{p.title}</div>
          <div style={{color:'rgba(255,255,255,0.6)', fontSize:12, marginBottom:8}}>{p.description}</div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
            {p.tags.map(t => (
              <span key={t} style={{
                padding:'2px 8px', borderRadius:12, fontSize:11,
                background:'rgba(57,255,20,0.1)',
                color:'#39ff14', border:'1px solid rgba(57,255,20,0.2)'
              }}>{t}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  )

  if (type === 'skills') return (
    <div style={{display:'flex', flexDirection:'column', gap:10}}>
      {SKILLS.map((skill, i) => (
        <div key={skill}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
            <span style={{color:'rgba(255,255,255,0.85)', fontSize:13}}>{skill}</span>
          </div>
          <div style={{height:4, borderRadius:2, background:'rgba(255,255,255,0.1)', overflow:'hidden'}}>
            <div style={{
              height:'100%', borderRadius:2,
              background:'linear-gradient(90deg, #39ff14, #00cc88)',
              width:`${75 + (i % 3) * 8}%`,
              transition:'width 0.8s ease',
            }}/>
          </div>
        </div>
      ))}
    </div>
  )

  if (type === 'contact') return (
    <div style={{display:'flex', flexDirection:'column', gap:12}}>
      <p style={{color:'rgba(255,255,255,0.7)', fontSize:13, marginBottom:8}}>
        Let's connect — reach out through any of these channels.
      </p>
      {SOCIALS.map(s => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
          style={{
            display:'flex', alignItems:'center', gap:12, textDecoration:'none',
            padding:'12px 16px', borderRadius:10,
            background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)',
            color:'rgba(255,255,255,0.85)', fontSize:14,
            transition:'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(57,255,20,0.4)'; e.currentTarget.style.background='rgba(57,255,20,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
        >
          <span style={{color:'#39ff14', opacity:0.9}}><SocialIcon type={s.icon} /></span>
          {s.label}
          <span style={{marginLeft:'auto', color:'rgba(255,255,255,0.3)', fontSize:12}}>↗</span>
        </a>
      ))}
    </div>
  )

  return null
}

export default function UI({ isDay, onToggleDay, activePanel, onClosePanel }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (activePanel) {
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
    }
  }, [activePanel])

  const panelInfo = activePanel ? PANELS[activePanel] : null

  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, bottom:0,
      pointerEvents:'none', zIndex:10,
      fontFamily:"'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── Top nav ── */}
      <div style={{
        position:'absolute', top:0, left:0, right:0,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'18px 28px', pointerEvents:'auto',
      }}>
        {/* Logo + name */}
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:'rgba(57,255,20,0.12)',
            backdropFilter:'blur(8px)',
            border:'1px solid rgba(57,255,20,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#39ff14', fontSize:18,
          }}>⬡</div>
          <div>
            <div style={{color:'white', fontWeight:500, fontSize:14, lineHeight:1.2}}>{PERSON.name}</div>
            <div style={{color:'rgba(255,255,255,0.45)', fontSize:11}}>{PERSON.tagline}</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          {Object.entries(PANELS).map(([key, val]) => (
            <button
              key={key}
              style={{
                padding:'7px 14px', borderRadius:8,
                background: activePanel === key ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.07)',
                backdropFilter:'blur(8px)',
                border: activePanel === key ? '1px solid rgba(57,255,20,0.35)' : '1px solid rgba(255,255,255,0.12)',
                color: activePanel === key ? '#39ff14' : 'rgba(255,255,255,0.7)',
                fontSize:12, cursor:'pointer', transition:'all 0.2s',
              }}
              onClick={() => activePanel === key ? onClosePanel() : onClosePanel(key)}
            >
              {val.icon} {val.title}
            </button>
          ))}

          {/* Day/night */}
          <button onClick={onToggleDay} style={{
            width:38, height:38, borderRadius:10,
            background:'rgba(255,255,255,0.07)',
            backdropFilter:'blur(8px)',
            border:'1px solid rgba(255,255,255,0.12)',
            color:'white', fontSize:16, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{isDay ? '☀️' : '🌙'}</button>
        </div>
      </div>

      {/* ── Side panel ── */}
      {activePanel && (
        <div style={{
          position:'absolute', right:0, top:0, bottom:0,
          width:340, pointerEvents:'auto',
          background:'rgba(6,13,26,0.85)',
          backdropFilter:'blur(20px)',
          borderLeft:'1px solid rgba(255,255,255,0.08)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          display:'flex', flexDirection:'column',
          overflowY:'auto',
        }}>
          {/* Panel header */}
          <div style={{
            padding:'72px 24px 20px',
            borderBottom:'1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4}}>
              <span style={{color:'#39ff14', fontSize:22}}>{panelInfo.icon}</span>
              <button onClick={onClosePanel} style={{
                width:30, height:30, borderRadius:8,
                background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.1)',
                color:'rgba(255,255,255,0.6)', fontSize:16,
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              }}>×</button>
            </div>
            <h2 style={{color:'white', fontWeight:500, fontSize:20, margin:0}}>{panelInfo.title}</h2>
          </div>

          {/* Panel body */}
          <div style={{padding:'20px 24px', flex:1}}>
            <PanelContent type={activePanel} />
          </div>
        </div>
      )}

      {/* ── Hint text ── */}
      {!activePanel && (
        <div style={{
          position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
          color:'rgba(255,255,255,0.35)', fontSize:12, letterSpacing:'0.06em',
          userSelect:'none', textAlign:'center', lineHeight:1.6,
        }}>
          drag to orbit · scroll to zoom · click objects to explore
        </div>
      )}
    </div>
  )
}
