import { EXPERIENCE, EDUCATION, CERTIFICATIONS, ACHIEVEMENTS, SKILLS, PERSON } from '../content.js'

const S = {
  h3: { color: '#39ff14', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14, opacity: 0.85 },
  section: { marginBottom: 28 },
  timelineItem: { position: 'relative', paddingLeft: 20, paddingBottom: 20, borderLeft: '2px solid rgba(57,255,20,0.2)' },
  dot: { position: 'absolute', left: -7, top: 4, width: 12, height: 12, borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 8px rgba(57,255,20,0.6)' },
  role: { color: 'white', fontWeight: 700, fontSize: 13.5 },
  company: { color: '#39ff14', fontSize: 12, fontWeight: 500, marginTop: 2 },
  meta: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 3, marginBottom: 8 },
  bullet: { color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 1.6, paddingLeft: 12, marginBottom: 4, position: 'relative' },
  card: { padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 },
}

export function ResumePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Download button */}
      <a href="https://vivekchoudhary.in" target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', padding: '10px', borderRadius: 10, background: 'rgba(57,255,20,0.12)', border: '1px solid rgba(57,255,20,0.3)', color: '#39ff14', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
        📄 View Full Portfolio Website ↗
      </a>

      {/* Experience */}
      <div style={S.section}>
        <div style={S.h3}>💼 Experience</div>
        <div style={{ paddingLeft: 4 }}>
          {EXPERIENCE.map((exp, i) => (
            <div key={i} style={{ ...S.timelineItem, ...(i === EXPERIENCE.length - 1 ? { borderLeft: '2px solid transparent' } : {}) }}>
              <div style={S.dot} />
              <div style={S.role}>{exp.role}</div>
              <div style={S.company}>{exp.company}</div>
              <div style={S.meta}>{exp.period} · {exp.location}</div>
              {exp.bullets.map((b, bi) => (
                <div key={bi} style={S.bullet}>• {b}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div style={S.section}>
        <div style={S.h3}>🎓 Education</div>
        <div style={{ paddingLeft: 4 }}>
          {EDUCATION.map((ed, i) => (
            <div key={i} style={{ ...S.timelineItem, ...(i === EDUCATION.length - 1 ? { borderLeft: '2px solid transparent' } : {}) }}>
              <div style={S.dot} />
              <div style={S.role}>{ed.degree}</div>
              <div style={S.company}>{ed.institute}</div>
              <div style={S.meta}>{ed.period} · {ed.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={S.section}>
        <div style={S.h3}>⚙️ Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SKILLS.map(s => (
            <span key={s} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.25)', color: '#39ff14', fontSize: 12, fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div style={S.section}>
        <div style={S.h3}>🏅 Certifications</div>
        {CERTIFICATIONS.map(c => (
          <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, ...S.card, transition: 'border-color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.35)'; e.currentTarget.style.background = 'rgba(57,255,20,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#39ff14', flexShrink: 0 }} />
            <div>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>{c.issuer} · {c.date}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'rgba(57,255,20,0.5)', fontSize: 11 }}>↗</span>
          </a>
        ))}
      </div>

      {/* Achievements */}
      <div style={S.section}>
        <div style={S.h3}>🏆 Achievements</div>
        {ACHIEVEMENTS.map(a => (
          <a key={a.title} href={a.url} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block', ...S.card, borderColor: 'rgba(255,215,0,0.18)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.18)' }}>
            <div style={{ color: '#ffd700', fontWeight: 700, fontSize: 13 }}>{a.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{a.desc}</div>
          </a>
        ))}
      </div>

    </div>
  )
}
