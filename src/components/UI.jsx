import { useState, useEffect } from 'react'
import { PERSON } from '../content.js'
import { AboutPage }   from './AboutPage.jsx'
import { ResumePage }  from './ResumePage.jsx'
import { BlogPage }    from './BlogPage.jsx'
import { ContactPage } from './ContactPage.jsx'
import { SocialPage }  from './SocialPage.jsx'

// Panel definitions — keyed to clickTarget values from FloatingIsland
const PANELS = {
  about:   { title: 'About Me',      icon: '◈', hint: 'Click monitor screen',   emoji: '🖥️',  component: <AboutPage />   },
  resume:  { title: 'Resume',        icon: '📄', hint: 'Click window glass',     emoji: '🪟',  component: <ResumePage />  },
  blog:    { title: 'Blog',          icon: '✍️', hint: 'Click canvas easel',     emoji: '🎨',  component: <BlogPage />    },
  contact: { title: 'Contact',       icon: '✉',  hint: 'Click the mailbox',      emoji: '📬',  component: <ContactPage /> },
  social:  { title: 'Social Links',  icon: '🔗', hint: 'Click social badges',    emoji: '🌐',  component: <SocialPage />  },
}

const FONT = "'DM Sans', 'Segoe UI', system-ui, sans-serif"

// Top-bar nav keys (compact)
const NAV_KEYS = ['about','resume','blog','contact','social']

export default function UI({ isDay, onToggleDay, activePanel, onClosePanel }) {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (activePanel) setTimeout(() => setVisible(true), 10)
    else setVisible(false)
  }, [activePanel])

  const panelInfo = activePanel ? PANELS[activePanel] : null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none', zIndex: 10, fontFamily: FONT,
    }}>

      {/* ── Top Navigation Bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 22px',
        background: 'linear-gradient(to bottom, rgba(6,13,26,0.7) 0%, transparent 100%)',
        pointerEvents: 'auto',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'rgba(57,255,20,0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(57,255,20,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#39ff14', fontSize: 18, fontWeight: 700, flexShrink: 0,
          }}>⬡</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{PERSON.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10.5, letterSpacing: '0.04em' }}>{PERSON.tagline}</div>
          </div>
        </div>

        {/* Nav pills */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {NAV_KEYS.map(key => {
            const p = PANELS[key]
            const isActive = activePanel === key
            return (
              <button key={key}
                style={{
                  padding: '7px 12px', borderRadius: 9,
                  background: isActive ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(14px)',
                  border: isActive ? '1px solid rgba(57,255,20,0.35)' : '1px solid rgba(255,255,255,0.1)',
                  color: isActive ? '#39ff14' : 'rgba(255,255,255,0.65)',
                  fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 500,
                  transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 5,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color='rgba(255,255,255,0.92)'; e.currentTarget.style.background='rgba(255,255,255,0.1)' }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color='rgba(255,255,255,0.65)'; e.currentTarget.style.background='rgba(255,255,255,0.06)' }}}
                onClick={() => isActive ? onClosePanel() : onClosePanel(key)}
              >
                <span style={{ fontSize: 11, opacity: 0.75 }}>{p.icon}</span>
                {p.title}
              </button>
            )
          })}

          {/* Day/Night */}
          <button onClick={onToggleDay} style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: 17, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>{isDay ? '☀️' : '🌙'}</button>
        </div>
      </div>

      {/* ── Click-hint labels floating above 3D objects ── */}
      {!activePanel && (
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          pointerEvents: 'none',
        }}>
          {/* Object interaction guide */}
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 4,
          }}>
            {[
              { label: 'Monitor → About',    emoji: '🖥️' },
              { label: 'Window → Resume',    emoji: '🪟' },
              { label: 'Easel → Blog',       emoji: '🎨' },
              { label: 'Mailbox → Contact',  emoji: '📬' },
              { label: 'Badges → Social',    emoji: '🔗' },
            ].map(h => (
              <div key={h.label} style={{
                padding: '4px 10px', borderRadius: 14,
                background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.45)', fontSize: 10.5,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span>{h.emoji}</span>{h.label}
              </div>
            ))}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.22)', fontSize: 11, letterSpacing: '0.07em',
            background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)',
            padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
          }}>
            drag to orbit · scroll to zoom · click objects to explore
          </div>
        </div>
      )}

      {/* ── Side Panel ── */}
      {activePanel && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 360, pointerEvents: 'auto',
          background: 'rgba(4,9,20,0.92)',
          backdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>

          {/* Panel header */}
          <div style={{
            padding: '70px 24px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'linear-gradient(to bottom, rgba(57,255,20,0.04), transparent)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 26, marginBottom: 5 }}>{panelInfo.emoji}</div>
                <h2 style={{ color: 'white', fontWeight: 700, fontSize: 20, margin: 0, letterSpacing: '-0.02em' }}>{panelInfo.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, margin: '4px 0 0', letterSpacing: '0.04em' }}>
                  {panelInfo.hint}
                </p>
              </div>
              <button onClick={onClosePanel} style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 2, transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
              >×</button>
            </div>

            {/* Sub-panel tabs */}
            <div style={{ display: 'flex', gap: 5, marginTop: 14, flexWrap: 'wrap' }}>
              {NAV_KEYS.filter(k => k !== activePanel).slice(0, 3).map(k => (
                <button key={k}
                  onClick={() => onClosePanel(k)}
                  style={{
                    padding: '4px 11px', borderRadius: 7,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(255,255,255,0.45)', fontSize: 11, cursor: 'pointer',
                    fontFamily: FONT, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)' }}
                >
                  {PANELS[k].icon} {PANELS[k].title}
                </button>
              ))}
            </div>
          </div>

          {/* Panel content */}
          <div style={{ padding: '20px 24px 32px', flex: 1, overflowY: 'auto' }}>
            {panelInfo.component}
          </div>

          {/* Panel footer */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10.5, textAlign: 'center', letterSpacing: '0.04em' }}>
              {PERSON.name} · {PERSON.tagline}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
