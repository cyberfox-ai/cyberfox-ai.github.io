import { SOCIALS, PERSON } from '../content.js'

const ICONS = {
  gh:  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>,
  li:  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  x:   <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  med: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>,
  em:  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
}

const BG = {
  gh: 'rgba(255,255,255,0.08)',
  li: 'rgba(10,102,194,0.18)',
  x:  'rgba(255,255,255,0.08)',
  med:'rgba(255,255,255,0.08)',
  em: 'rgba(57,255,20,0.1)',
}
const BORDER = {
  gh: 'rgba(255,255,255,0.15)',
  li: 'rgba(10,102,194,0.4)',
  x:  'rgba(255,255,255,0.15)',
  med:'rgba(255,255,255,0.15)',
  em: 'rgba(57,255,20,0.3)',
}

export function SocialPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #39ff14, #00cc88)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>🦊</div>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{PERSON.name}</div>
        <div style={{ color: '#39ff14', fontSize: 12, marginTop: 3 }}>@sudovivek</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, marginTop: 6, lineHeight: 1.6 }}>
          OSCP · Security Engineer · Bug Hunter
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SOCIALS.map(s => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              textDecoration: 'none', padding: '14px 18px',
              borderRadius: 12, background: BG[s.icon], border: `1px solid ${BORDER[s.icon]}`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateX(4px)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateX(0)'; e.currentTarget.style.boxShadow='none' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.icon === 'em' ? '#39ff14' : 'white', flexShrink: 0 }}>
              {ICONS[s.icon]}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{s.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>{s.url.replace('https://', '').replace('mailto:', '')}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>→</span>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 22, padding: '14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11.5, lineHeight: 1.6 }}>
          Open for collaborations, bug bounty tips, and security discussions.
        </div>
      </div>
    </div>
  )
}
