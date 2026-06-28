const CERTS = [
  { icon: '☁️', title: 'Microsoft Azure AI-102', meta: 'Microsoft · High demand ↑', badge: 'PRIORITY #1', color: 'var(--cyan)', bc: 'rgba(0,245,255,0.3)', bg: 'rgba(0,245,255,0.05)' },
  { icon: '🔵', title: 'Google Cloud Digital Leader', meta: 'Google · Free voucher', badge: 'FREE', color: 'var(--green)', bc: 'rgba(0,255,159,0.3)', bg: 'rgba(0,255,159,0.05)' },
  { icon: '🟢', title: 'GFG DSA Self-Paced', meta: 'GeeksforGeeks · Placement', badge: 'WEAK AREA', color: 'var(--yellow)', bc: 'rgba(255,230,0,0.3)', bg: 'rgba(255,230,0,0.05)' },
];

const EVENTS = [
  { icon: '🏛️', title: 'Inc42 AI Summit', meta: 'Delhi · Off-campus · Jul 2', badge: 'MUST ATTEND', color: 'var(--magenta)', bc: 'rgba(255,45,120,0.3)', bg: 'rgba(255,45,120,0.05)' },
  { icon: '🎓', title: 'KIIT AI Workshop', meta: 'KIIT Campus · Jul 1 · Free', badge: 'ON CAMPUS', color: 'var(--green)', bc: 'rgba(0,255,159,0.3)', bg: 'rgba(0,255,159,0.05)' },
  { icon: '🌐', title: 'Global AI Community', meta: 'Bhubaneswar · Jul 3', badge: 'NETWORK', color: 'var(--purple)', bc: 'rgba(180,77,255,0.3)', bg: 'rgba(180,77,255,0.05)' },
];

const HACKS = [
  { icon: '🤖', title: 'Lablab.ai LLM Hackathon', meta: 'Global · Online · AI Agents', badge: 'ROI 96', color: 'var(--cyan)', bc: 'rgba(0,245,255,0.3)', bg: 'rgba(0,245,255,0.05)' },
  { icon: '🏆', title: 'Flipkart Grid 6.0', meta: 'Global · 🔥 3 days left', badge: 'CRITICAL', color: 'var(--magenta)', bc: 'rgba(255,45,120,0.3)', bg: 'rgba(255,45,120,0.05)' },
  { icon: '🎯', title: 'KIIT Hackfest 2026', meta: 'KIIT Campus · Internal', badge: 'ON CAMPUS', color: 'var(--green)', bc: 'rgba(0,255,159,0.3)', bg: 'rgba(0,255,159,0.05)' },
];

const cols = [
  { title: '🎓 3 Certifications', accent: 'var(--cyan)',    items: CERTS  },
  { title: '📍 Events & Summits', accent: 'var(--magenta)', items: EVENTS },
  { title: '⚡ Hackathons',       accent: 'var(--yellow)',  items: HACKS  },
];

export default function WeeklyPlan() {
  return (
    <div className="cp-panel">
      <div className="cp-title">
        // Weekly battle plan
        <span className="cp-badge">AUTO-GENERATED · SUNDAY</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
        {cols.map(({ title, accent, items }) => (
          <div key={title} style={{
            background: 'var(--bg3)',
            border: `1px solid var(--border2)`,
            borderRadius: 3, padding: 8,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent},transparent)` }} />
            <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, fontWeight: 700, color: accent, textShadow: `0 0 8px ${accent}80`, marginBottom: 7, letterSpacing: '0.1em' }}>
              {title}
            </div>
            {items.map(({ icon, title: t, meta, badge, color, bc, bg }) => (
              <div key={t} style={{ display: 'flex', gap: 5, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: 12, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text)', lineHeight: 1.3 }}>{t}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{meta}</div>
                  <div style={{ display: 'inline-block', fontSize: 7, padding: '1px 4px', borderRadius: 2, marginTop: 3, border: `1px solid ${bc}`, background: bg, color, letterSpacing: '0.05em' }}>
                    {badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}