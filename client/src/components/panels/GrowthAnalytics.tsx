const PLATFORMS = [
  { name: 'Devpost',     val: 92, grad: 'linear-gradient(90deg,var(--cyan),var(--green))'    },
  { name: 'Lablab.ai',   val: 88, grad: 'linear-gradient(90deg,var(--purple),var(--cyan))'   },
  { name: 'Google Dev',  val: 85, grad: 'linear-gradient(90deg,var(--green),#00e5ff)'        },
  { name: 'Unstop',      val: 78, grad: 'linear-gradient(90deg,var(--yellow),#ffb300)'       },
  { name: 'HackerEarth', val: 60, grad: 'linear-gradient(90deg,var(--magenta),#ff6090)'      },
];

const SKILLS = [
  { name: 'Generative AI', val: 96, trend: '↑', trendColor: 'var(--green)',   grad: 'linear-gradient(90deg,var(--purple),var(--cyan))'  },
  { name: 'LLM Agents',    val: 90, trend: '↑', trendColor: 'var(--green)',   grad: 'linear-gradient(90deg,var(--cyan),var(--purple))'  },
  { name: 'Azure Cloud',   val: 85, trend: '↑', trendColor: 'var(--green)',   grad: 'linear-gradient(90deg,var(--cyan),#0090ff)'        },
  { name: 'DSA / CP',      val: 70, trend: '→', trendColor: 'var(--yellow)',  grad: 'linear-gradient(90deg,var(--yellow),#ff9000)'      },
  { name: 'Web3',          val: 28, trend: '↓', trendColor: 'var(--magenta)', grad: 'var(--magenta)'                                    },
];

const CERTS = [
  { name: 'Google Cloud', val: 80, interviews: 2, grad: 'linear-gradient(90deg,var(--green),#00e5ff)' },
  { name: 'IBM Full Stack', val: 50, interviews: 1, grad: 'linear-gradient(90deg,var(--cyan),var(--green))' },
  { name: 'Azure AI-102',  val: 20, interviews: 0, grad: 'var(--muted)' },
];

const TWIN = [
  { name: 'AI / ML',     val: 72, match: 'Strong',  matchColor: 'var(--green)',   bc: 'rgba(0,255,159,0.3)',  bg: 'rgba(0,255,159,0.08)',  grad: 'linear-gradient(90deg,var(--purple),var(--cyan))'  },
  { name: 'Cloud',       val: 48, match: 'Growing', matchColor: 'var(--yellow)',  bc: 'rgba(255,230,0,0.3)',  bg: 'rgba(255,230,0,0.08)',  grad: 'linear-gradient(90deg,var(--cyan),#0090ff)'        },
  { name: 'Backend',     val: 65, match: 'Good',    matchColor: 'var(--green)',   bc: 'rgba(0,255,159,0.3)',  bg: 'rgba(0,255,159,0.08)',  grad: 'linear-gradient(90deg,var(--green),#00e5ff)'       },
  { name: 'DSA',         val: 40, match: 'Weak ⚠',  matchColor: 'var(--magenta)',bc: 'rgba(255,45,120,0.3)', bg: 'rgba(255,45,120,0.08)', grad: 'var(--magenta)'                                   },
  { name: 'Open Source', val: 55, match: 'Fair',    matchColor: 'var(--muted)',   bc: 'var(--border2)',       bg: 'rgba(255,255,255,0.02)',grad: 'linear-gradient(90deg,var(--purple),var(--magenta))'},
  { name: 'LLM / Agents',val: 68, match: 'Good',    matchColor: 'var(--green)',   bc: 'rgba(0,255,159,0.3)',  bg: 'rgba(0,255,159,0.08)',  grad: 'linear-gradient(90deg,var(--cyan),var(--purple))'  },
];

const TIMELINE = [
  { label: 'Internship readiness', date: 'Est. Jun 2027', val: 74, color: 'var(--green)'   },
  { label: 'Portfolio completion', date: 'Est. Sep 2026', val: 58, color: 'var(--cyan)'    },
  { label: 'Cloud cert stack (3 certs)', date: 'Est. Dec 2026', val: 33, color: 'var(--yellow)'  },
  { label: '10 hackathons milestone', date: 'Est. Feb 2027 · 12 done ✓', val: 100, color: 'var(--purple)'  },
  { label: 'Placement readiness', date: 'Est. Mar 2028', val: 25, color: 'var(--purple)'  },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-hd)', fontSize: 7, color: 'var(--muted)',
      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
    }}>{children}</div>
  );
}

function NeonBar({ val, grad, height = 4 }: { val: number; grad: string; height?: number }) {
  return (
    <div style={{ flex: 1, height, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${val}%`,
        background: grad, borderRadius: 1,
        boxShadow: `0 0 4px ${grad.includes('cyan') ? 'rgba(0,245,255,0.3)' : 'rgba(180,77,255,0.2)'}`,
      }} />
    </div>
  );
}

export default function GrowthAnalytics() {
  return (
    <div className="cp-panel">
      <div className="cp-title">
        // Growth analytics
        <span className="cp-badge">YOUR CAREER DATA</span>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
        {[
          { val: '43', label: 'Opportunities/month', color: 'var(--cyan)'    },
          { val: '12', label: 'Hackathons done',      color: 'var(--green)'   },
          { val: '8',  label: 'Certs earned',         color: 'var(--purple)'  },
          { val: '3',  label: 'Led to interviews',    color: 'var(--yellow)'  },
        ].map(({ val, label, color }) => (
          <div key={label} style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 3, padding: '8px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
              background: color, opacity: 0.6,
            }} />
            <div style={{ fontFamily: 'var(--font-hd)', fontSize: 18, fontWeight: 900, color, textShadow: `0 0 12px ${color}80` }}>{val}</div>
            <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Platform ROI + Skills ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
        <div>
          <SectionTitle>Platform ROI ranking</SectionTitle>
          {PLATFORMS.map(({ name, val, grad }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ fontSize: 9, color: '#5a6080', width: 85, flexShrink: 0 }}>{name}</div>
              <NeonBar val={val} grad={grad} />
              <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 22, textAlign: 'right' }}>{val}</div>
            </div>
          ))}
        </div>
        <div>
          <SectionTitle>Skills in demand ↑</SectionTitle>
          {SKILLS.map(({ name, val, trend, trendColor, grad }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ fontSize: 9, color: '#5a6080', width: 85, flexShrink: 0 }}>{name}</div>
              <NeonBar val={val} grad={grad} />
              <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: trendColor, width: 22, textAlign: 'right', textShadow: `0 0 6px ${trendColor}80` }}>
                {trend}{val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cert → Interview pipeline ── */}
      <div style={{ marginBottom: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <SectionTitle>Cert → interview pipeline</SectionTitle>
        {CERTS.map(({ name, val, interviews, grad }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ fontSize: 9, color: '#5a6080', width: 85, flexShrink: 0 }}>{name}</div>
            <NeonBar val={val} grad={grad} />
            <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', width: 30, textAlign: 'right', color: interviews > 0 ? 'var(--green)' : 'var(--muted)' }}>
              {interviews > 0 ? `${interviews} intv` : '—'}
            </div>
          </div>
        ))}
      </div>

      {/* ── Career Digital Twin + Timeline ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>

        {/* Digital Twin */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <SectionTitle>Career digital twin</SectionTitle>
            <div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'var(--font-hd)', letterSpacing: '0.08em', marginTop: -1 }}>
              Profile vs opportunities
            </div>
          </div>
          {TWIN.map(({ name, val, match, matchColor, bc, bg, grad }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <div style={{ fontSize: 9, color: '#6070a0', width: 70, flexShrink: 0 }}>{name}</div>
              <NeonBar val={val} grad={grad} />
              <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 20, textAlign: 'right' }}>{val}</div>
              <div style={{
                fontSize: 7, padding: '1px 4px', borderRadius: 2, flexShrink: 0,
                border: `1px solid ${bc}`, background: bg, color: matchColor,
                letterSpacing: '0.05em', width: 50, textAlign: 'center',
              }}>{match}</div>
            </div>
          ))}
          <div style={{ marginTop: 7, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 8, color: 'var(--muted)' }}>
            Best match: <span style={{ color: 'var(--cyan)', textShadow: '0 0 8px rgba(0,245,255,0.4)' }}>Google Cloud Agent Hackathon</span> — 94% fit
          </div>
        </div>

        {/* Timeline Prediction */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <SectionTitle>Timeline prediction</SectionTitle>
            <div style={{ fontSize: 7, color: 'var(--muted)', fontFamily: 'var(--font-hd)', letterSpacing: '0.08em', marginTop: -1 }}>
              AI forecast · current pace
            </div>
          </div>
          {TIMELINE.map(({ label, date, val, color }) => (
            <div key={label} style={{ display: 'flex', gap: 7, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'flex-start' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                border: `1.5px solid ${color}`,
                background: `${color}25`,
                boxShadow: `0 0 6px ${color}50`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: 'var(--text)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{date} · {val}%</div>
                <div style={{ marginTop: 3, height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${val}%`, background: color, borderRadius: 1, boxShadow: `0 0 4px ${color}80` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}