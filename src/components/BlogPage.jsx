import { BLOGS } from '../content.js'

export function BlogPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
        Security research, CTF writeups, and vulnerability deep-dives on Medium.
      </p>

      {/* Featured blog */}
      {BLOGS.map(b => (
        <a key={b.id} href={b.url} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'block', textDecoration: 'none',
            padding: '16px', borderRadius: 12,
            background: 'rgba(57,255,20,0.05)',
            border: '1px solid rgba(57,255,20,0.18)',
            marginBottom: 14, transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(57,255,20,0.5)'; e.currentTarget.style.background='rgba(57,255,20,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(57,255,20,0.18)'; e.currentTarget.style.background='rgba(57,255,20,0.05)' }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {b.tags.map(t => (
              <span key={t} style={{ padding: '2px 9px', borderRadius: 12, background: 'rgba(57,255,20,0.15)', color: '#39ff14', fontSize: 10, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 8 }}>{b.title}</div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{b.excerpt}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{b.date}</span>
            <span style={{ color: '#39ff14', fontSize: 12, fontWeight: 600 }}>Read on Medium ↗</span>
          </div>
        </a>
      ))}

      {/* More blogs CTA */}
      <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>✍️</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
          More articles on web app security, penetration testing techniques, and CTF writeups.
        </div>
        <a href="https://medium.com/@sudovivek" target="_blank" rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'inline-block', padding: '9px 20px', borderRadius: 10, background: 'rgba(57,255,20,0.12)', border: '1px solid rgba(57,255,20,0.3)', color: '#39ff14', fontSize: 13, fontWeight: 600 }}>
          Follow on Medium →
        </a>
      </div>

      {/* Topics */}
      <div style={{ marginTop: 20 }}>
        <div style={{ color: '#39ff14', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, opacity: 0.85 }}>Topics Covered</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['OWASP Top 10','Web Application Security','API Security','Broken Access Control','CTF Writeups','Penetration Testing','Bug Bounty','Vulnerability Research'].map(t => (
            <span key={t} style={{ padding: '4px 10px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
