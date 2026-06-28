import { useState } from 'react';

const MILESTONES = [
  { title: 'Complete 5 hackathons',        target: 'Dec 2025', done: true,  progress: 100 },
  { title: 'Earn 3 cloud certifications',  target: 'Mar 2026', done: false, progress: 33  },
  { title: 'Contribute to open source',    target: 'Apr 2026', done: false, progress: 55  },
  { title: 'Land first internship',        target: 'Jun 2026', done: false, progress: 20  },
  { title: 'Build 3 production projects',  target: 'Aug 2026', done: false, progress: 66  },
  { title: 'Get 1000 LinkedIn followers',  target: 'Oct 2026', done: false, progress: 40  },
  { title: '10 hackathons completed',      target: 'Dec 2026', done: false, progress: 12  },
  { title: 'Full-time SWE offer',          target: 'Jun 2029', done: false, progress: 5   },
];

const ROADMAP = [
  { phase: '01', title: 'Foundation',      period: 'Year 1 · 2025–2026', color: 'var(--green)',   status: 'ACTIVE',    items: ['GSSoC open source', 'Google Cloud cert', 'OpportunityOS project', '5 hackathons'] },
  { phase: '02', title: 'Specialization',  period: 'Year 2 · 2026–2027', color: 'var(--cyan)',    status: 'UPCOMING',  items: ['Azure AI-102 cert', 'SIH hackathon', 'First internship', 'LLM agent projects'] },
  { phase: '03', title: 'Leadership',      period: 'Year 3 · 2027–2028', color: 'var(--purple)',  status: 'PLANNED',   items: ['Senior internship', 'Open source maintainer', 'Tech blog', 'Conference talks'] },
  { phase: '04', title: 'Placement',       period: 'Year 4 · 2028–2029', color: 'var(--magenta)', status: 'GOAL',      items: ['FAANG interviews', 'Offer letter', 'SWE role', 'Legacy projects'] },
];

const SKILLS_NEEDED = [
  { name: 'System Design',    current: 20, needed: 85, color: 'var(--cyan)'    },
  { name: 'DSA / CP',         current: 40, needed: 90, color: 'var(--magenta)' },
  { name: 'Cloud (Azure)',     current: 48, needed: 80, color: 'var(--green)'   },
  { name: 'LLM / AI Agents',  current: 68, needed: 85, color: 'var(--purple)'  },
  { name: 'Backend / APIs',   current: 65, needed: 80, color: 'var(--cyan)'    },
  { name: 'Open Source',      current: 55, needed: 75, color: 'var(--yellow)'  },
];

export default function GoalsPage() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono)' }}>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 14, fontWeight: 900, color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)', letterSpacing: '0.15em' }}>
          // CAREER GPS
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.08em' }}>
          GOAL: SOFTWARE ENGINEER AT TOP TECH COMPANY · TARGET: 2029
        </div>
      </div>

      {/* Goal card + Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

        {/* Goal */}
        <div style={{
          background: 'linear-gradient(135deg,#03030a,#06061a)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: 4, padding: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent)' }} />
          <div style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 6 }}>// PRIMARY OBJECTIVE</div>
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 16, fontWeight: 900, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
            SOFTWARE ENGINEER<br />
            <span style={{ color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)' }}>@ TOP TECH</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 12 }}>Target: June 2029 · KIIT CSE Year 1</div>

          {/* Big progress ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="100%" stopColor="#b44dff" />
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="url(#pg)" strokeWidth="6"
                strokeDasharray="201" strokeDashoffset="86"
                strokeLinecap="round" transform="rotate(-90 40 40)"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.5))' }} />
              <text x="40" y="36" textAnchor="middle" fill="#00f5ff" fontSize="13" fontFamily="Orbitron,monospace" fontWeight="900">58%</text>
              <text x="40" y="48" textAnchor="middle" fill="#2a2a60" fontSize="7" fontFamily="Share Tech Mono,monospace">COMPLETE</text>
            </svg>
            <div>
              <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>OVERALL PROGRESS</div>
              <div style={{ fontSize: 9, color: 'var(--green)', marginBottom: 2 }}>✓ Hackathons: 12 done</div>
              <div style={{ fontSize: 9, color: 'var(--cyan)',  marginBottom: 2 }}>◈ Certs: 8 earned</div>
              <div style={{ fontSize: 9, color: 'var(--yellow)',marginBottom: 2 }}>⏱ Est. readiness: Jun 2027</div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>Streak: <span style={{ color: 'var(--yellow)', textShadow: '0 0 6px rgba(255,230,0,0.5)' }}>7 DAYS 🔥</span></div>
            </div>
          </div>
        </div>

        {/* Skills gap */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--magenta),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--magenta)', letterSpacing: '0.12em', marginBottom: 10, textShadow: '0 0 8px rgba(255,45,120,0.5)' }}>
            // SKILL GAP ANALYSIS
          </div>
          {SKILLS_NEEDED.map(({ name, current, needed, color }) => (
            <div key={name} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: '#7a8aaa' }}>{name}</span>
                <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                  <span style={{ color }}>{current}</span> / {needed}
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
                {/* Needed bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${needed}%`, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                {/* Current bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${current}%`, background: color, borderRadius: 1, boxShadow: `0 0 4px ${color}80` }} />
              </div>
              <div style={{ fontSize: 7, color: 'var(--muted)', marginTop: 1 }}>
                Gap: <span style={{ color: current >= needed ? 'var(--green)' : 'var(--magenta)' }}>{Math.max(0, needed - current)}%</span> to fill
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)', opacity: 0.3 }} />
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--cyan)', letterSpacing: '0.12em', marginBottom: 12, textShadow: '0 0 8px rgba(0,245,255,0.4)' }}>
          // CAREER ROADMAP · 4 PHASES
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {ROADMAP.map(({ phase, title, period, color, status, items }, i) => (
            <div key={phase} onClick={() => setActivePhase(i)} style={{
              background: activePhase === i ? `${color}08` : 'rgba(0,0,0,0.2)',
              border: `1px solid ${activePhase === i ? color + '40' : 'var(--border2)'}`,
              borderRadius: 3, padding: 10, cursor: 'pointer', transition: 'all 0.2s',
              position: 'relative', overflow: 'hidden',
            }}>
              {activePhase === i && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
              )}
              <div style={{ fontFamily: 'var(--font-hd)', fontSize: 18, fontWeight: 900, color, opacity: 0.3, marginBottom: 4 }}>{phase}</div>
              <div style={{ fontFamily: 'var(--font-hd)', fontSize: 9, fontWeight: 700, color, textShadow: `0 0 8px ${color}60`, marginBottom: 2, letterSpacing: '0.08em' }}>{title}</div>
              <div style={{ fontSize: 8, color: 'var(--muted)', marginBottom: 8 }}>{period}</div>
              <div style={{
                display: 'inline-block', fontSize: 7, padding: '2px 6px', borderRadius: 2,
                border: `1px solid ${color}30`, background: `${color}08`, color,
                letterSpacing: '0.08em', marginBottom: 8,
              }}>{status}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 8, color: '#6070a0' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--purple),transparent)', opacity: 0.4 }} />
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: 10, textShadow: '0 0 8px rgba(180,77,255,0.5)' }}>
          // MILESTONES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
          {MILESTONES.map(({ title, target, done, progress }) => (
            <div key={title} style={{
              background: done ? 'rgba(0,255,159,0.04)' : 'rgba(0,0,0,0.2)',
              border: `1px solid ${done ? 'rgba(0,255,159,0.15)' : 'var(--border2)'}`,
              borderRadius: 3, padding: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 2,
                    background: done ? 'rgba(0,255,159,0.15)' : 'transparent',
                    border: `1px solid ${done ? 'rgba(0,255,159,0.5)' : 'var(--border2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: 'var(--green)',
                  }}>{done ? '✓' : ''}</div>
                  <span style={{ fontSize: 9, color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>{title}</span>
                </div>
                <span style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{target}</span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progress}%`,
                  background: done ? 'var(--green)' : 'linear-gradient(90deg,var(--cyan),var(--purple))',
                  borderRadius: 1, boxShadow: done ? '0 0 4px var(--green)' : '0 0 4px rgba(0,245,255,0.3)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ fontSize: 7, color: 'var(--muted)', marginTop: 2, textAlign: 'right' }}>{progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}