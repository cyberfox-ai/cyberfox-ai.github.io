import { PERSON, ABOUT, SERVICES, CERTIFICATIONS, SKILLS, ACHIEVEMENTS } from '../content.js'

const S = {
  section: { marginBottom: 28 },
  h3: { color: '#39ff14', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, opacity: 0.85 },
  p: { color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, fontSize: 13 },
  tag: (col='#39ff14') => ({ padding: '3px 10px', borderRadius: 20, background: `${col}18`, border: `1px solid ${col}35`, color: col, fontSize: 11, fontWeight: 500, display: 'inline-block', margin: '3px 4px 3px 0' }),
  card: { padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 },
  certRow: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
}

export function AboutPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Avatar + intro */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '16px', borderRadius: 12, background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.12)' }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'linear-gradient(135deg, #39ff14, #00cc88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🦊</div>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>{PERSON.name}</div>
          <div style={{ color: '#39ff14', fontSize: 12, marginTop: 2 }}>{PERSON.tagline}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>📍 {PERSON.location}</div>
        </div>
      </div>

      {/* Bio */}
      <div style={S.section}>
        <div style={S.h3}>About Me</div>
        <p style={S.p}>{ABOUT}</p>
      </div>

      {/* Tags */}
      <div style={{ ...S.section, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {['OSCP Certified','Penetration Tester','Bug Hunter','CTF Player','Red Teamer','API Security'].map(t => (
          <span key={t} style={S.tag('#39ff14')}>{t}</span>
        ))}
      </div>

      {/* What I do */}
      <div style={S.section}>
        <div style={S.h3}>What I Do</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SERVICES.map(s => (
            <div key={s.title} style={S.card}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={S.section}>
        <div style={S.h3}>Skills</div>
        {SKILLS.map((sk, i) => {
          const pct = 78 + (i % 4) * 5
          return (
            <div key={sk} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{sk}</span>
                <span style={{ color: 'rgba(57,255,20,0.7)', fontSize: 11 }}>{pct}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#39ff14,#00cc88)', width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Certifications */}
      <div style={S.section}>
        <div style={S.h3}>Certifications</div>
        {CERTIFICATIONS.map(c => (
          <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', ...S.certRow }}
             onMouseEnter={e => e.currentTarget.style.opacity='0.8'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(57,255,20,0.12)', border: '1px solid rgba(57,255,20,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>🏅</div>
            <div>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>{c.issuer} · {c.date}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Achievements */}
      <div style={S.section}>
        <div style={S.h3}>Achievements</div>
        {ACHIEVEMENTS.map(a => (
          <a key={a.title} href={a.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', ...S.card, marginBottom: 8, borderColor: 'rgba(255,215,0,0.18)' }}
             onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,215,0,0.4)'; e.currentTarget.style.background='rgba(255,215,0,0.06)' }}
             onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,215,0,0.18)'; e.currentTarget.style.background='rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#ffd700', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🏆 {a.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.5 }}>{a.desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
