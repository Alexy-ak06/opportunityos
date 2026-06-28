const MONTHLY_DATA = [
  { month: 'Jan', found: 12, applied: 3, certs: 1 },
  { month: 'Feb', found: 18, applied: 5, certs: 2 },
  { month: 'Mar', found: 24, applied: 7, certs: 1 },
  { month: 'Apr', found: 31, applied: 9, certs: 2 },
  { month: 'May', found: 38, applied: 11, certs: 3 },
  { month: 'Jun', found: 43, applied: 14, certs: 2 },
];

const PLATFORM_STATS = [
  { name: 'Devpost',      opportunities: 18, applied: 6, won: 2, roi: 92, color: 'var(--cyan)'    },
  { name: 'Unstop',       opportunities: 12, applied: 4, won: 1, roi: 78, color: 'var(--yellow)'  },
  { name: 'Lablab.ai',    opportunities: 8,  applied: 3, won: 1, roi: 88, color: 'var(--purple)'  },
  { name: 'Google Dev',   opportunities: 6,  applied: 2, won: 0, roi: 85, color: 'var(--green)'   },
  { name: 'HackerEarth',  opportunities: 5,  applied: 2, won: 0, roi: 60, color: 'var(--magenta)' },
  { name: 'KIIT Campus',  opportunities: 4,  applied: 3, won: 1, roi: 70, color: 'var(--cyan)'    },
];

const CERT_STATS = [
  { name: 'Google Cloud Digital Leader', date: 'Mar 2026', interviews: 2, resumeBoost: 9, color: 'var(--cyan)'   },
  { name: 'IBM Full Stack Developer',    date: 'Jan 2026', interviews: 1, resumeBoost: 8, color: 'var(--blue)'   },
  { name: 'Microsoft Azure AI-102',      date: 'In progress', interviews: 0, resumeBoost: 9, color: 'var(--purple)' },
  { name: 'Fortinet NSE 1',              date: 'Dec 2025', interviews: 0, resumeBoost: 5, color: 'var(--green)'  },
];

const SKILL_DEMAND = [
  { skill: 'Generative AI',  demand: 96, growth: '+12%', color: 'linear-gradient(90deg,var(--purple),var(--cyan))'   },
  { skill: 'LLM Agents',     demand: 90, growth: '+18%', color: 'linear-gradient(90deg,var(--cyan),var(--purple))'   },
  { skill: 'Azure Cloud',    demand: 85, growth: '+8%',  color: 'linear-gradient(90deg,var(--cyan),#0090ff)'         },
  { skill: 'RAG Systems',    demand: 80, growth: '+22%', color: 'linear-gradient(90deg,var(--magenta),var(--purple))' },
  { skill: 'DSA / CP',       demand: 70, growth: '+2%',  color: 'linear-gradient(90deg,var(--yellow),#ff9000)'       },
  { skill: 'Web3 / Blockchain', demand: 28, growth: '-8%', color: 'var(--magenta)'                                   },
];

const ACTIVITY = [
  { week: 'W1', commits: 12, posts: 2, hackathons: 1 },
  { week: 'W2', commits: 8,  posts: 3, hackathons: 0 },
  { week: 'W3', commits: 15, posts: 1, hackathons: 2 },
  { week: 'W4', commits: 20, posts: 4, hackathons: 1 },
];

function NeonBar({ val, max = 100, grad, height = 4 }: { val: number; max?: number; grad: string; height?: number }) {
  return (
    <div style={{ flex: 1, height, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: grad, borderRadius: 1, boxShadow: `0 0 4px ${grad.includes('cyan') ? 'rgba(0,245,255,0.3)' : 'rgba(180,77,255,0.2)'}` }} />
    </div>
  );
}

function StatCard({ val, label, color, sub }: { val: string; label: string; color: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 3, padding: '10px 12px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: color, opacity: 0.6 }} />
      <div style={{ fontFamily: 'var(--font-hd)', fontSize: 22, fontWeight: 900, color, textShadow: `0 0 15px ${color}80` }}>{val}</div>
      <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      {sub && <div style={{ fontSize: 8, color, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const maxFound = Math.max(...MONTHLY_DATA.map(d => d.found));

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono)' }}>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 14, fontWeight: 900, color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)', letterSpacing: '0.15em' }}>
          // ANALYTICS
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.08em' }}>
          CAREER INTELLIGENCE · JUNE 2026 · KIIT BHUBANESWAR
        </div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, marginBottom: 10 }}>
        <StatCard val="43"  label="Opportunities"  color="var(--cyan)"    sub="this month" />
        <StatCard val="14"  label="Applications"   color="var(--green)"   sub="+3 this week" />
        <StatCard val="8"   label="Certs earned"   color="var(--purple)"  sub="all time" />
        <StatCard val="12"  label="Hackathons"      color="var(--yellow)"  sub="completed" />
        <StatCard val="3"   label="Interviews"      color="var(--magenta)" sub="from certs" />
        <StatCard val="58%" label="Career progress" color="var(--cyan)"    sub="to SWE goal" />
      </div>

      {/* Chart + Platform ROI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

        {/* Monthly chart */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)', opacity: 0.3 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--cyan)', letterSpacing: '0.12em', marginBottom: 12 }}>// MONTHLY ACTIVITY</div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 8 }}>
            {MONTHLY_DATA.map(({ month, found, applied, certs }) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 1 }}>
                  <div style={{ width: '100%', height: `${(found / maxFound) * 90}px`, background: 'linear-gradient(180deg,var(--cyan),rgba(0,245,255,0.2))', borderRadius: '2px 2px 0 0', boxShadow: '0 0 6px rgba(0,245,255,0.3)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: 'var(--cyan)', fontFamily: 'var(--font-hd)', whiteSpace: 'nowrap' }}>{found}</div>
                  </div>
                </div>
                <div style={{ fontSize: 7, color: 'var(--muted)', letterSpacing: '0.05em' }}>{month}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { color: 'var(--cyan)',    label: 'Found' },
              { color: 'var(--green)',   label: 'Applied' },
              { color: 'var(--purple)',  label: 'Certs' },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 3, background: color, borderRadius: 1 }} />
                <span style={{ fontSize: 8, color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform ROI */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--yellow),transparent)', opacity: 0.3 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--yellow)', letterSpacing: '0.12em', marginBottom: 12 }}>// PLATFORM ROI RANKING</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4, marginBottom: 8, fontSize: 7, color: 'var(--muted)', letterSpacing: '0.06em' }}>
            <span>PLATFORM</span><span style={{ textAlign: 'center' }}>OPPS</span><span style={{ textAlign: 'center' }}>WINS</span><span style={{ textAlign: 'right' }}>ROI</span>
          </div>

          {PLATFORM_STATS.map(({ name, opportunities, applied, won, roi, color }) => (
            <div key={name} style={{ marginBottom: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4, marginBottom: 3, alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: '#7a8aaa' }}>{name}</span>
                <span style={{ fontSize: 9, color: 'var(--text)', textAlign: 'center' }}>{opportunities}</span>
                <span style={{ fontSize: 9, color: won > 0 ? 'var(--green)' : 'var(--muted)', textAlign: 'center' }}>{won}</span>
                <span style={{ fontSize: 9, color, textAlign: 'right', fontFamily: 'var(--font-hd)', textShadow: `0 0 6px ${color}60` }}>{roi}</span>
              </div>
              <NeonBar val={roi} grad={`linear-gradient(90deg,${color},${color}80)`} />
            </div>
          ))}
        </div>
      </div>

      {/* Cert pipeline + Skill demand */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

        {/* Cert pipeline */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--purple),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: 12 }}>// CERT → INTERVIEW PIPELINE</div>

          {CERT_STATS.map(({ name, date, interviews, resumeBoost, color }) => (
            <div key={name} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border2)', borderRadius: 3, padding: 8, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text)', fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-hd)', fontWeight: 900, color: interviews > 0 ? 'var(--green)' : 'var(--muted)', textShadow: interviews > 0 ? '0 0 10px rgba(0,255,159,0.5)' : 'none' }}>
                    {interviews > 0 ? `${interviews} INTV` : '—'}
                  </div>
                  <div style={{ fontSize: 7, color: 'var(--muted)' }}>Resume +{resumeBoost}</div>
                </div>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(resumeBoost / 10) * 100}%`, background: color, borderRadius: 1, boxShadow: `0 0 4px ${color}80` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Skill demand */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--green),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--green)', letterSpacing: '0.12em', marginBottom: 12 }}>// SKILLS IN DEMAND · JUNE 2026</div>

          {SKILL_DEMAND.map(({ skill, demand, growth, color }) => {
            const isUp = growth.startsWith('+');
            return (
              <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: '#7a8aaa', width: 110, flexShrink: 0 }}>{skill}</div>
                <NeonBar val={demand} grad={color} />
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', width: 28, textAlign: 'right', color: isUp ? 'var(--green)' : 'var(--magenta)', textShadow: `0 0 6px ${isUp ? 'rgba(0,255,159,0.4)' : 'rgba(255,45,120,0.4)'}` }}>{demand}</div>
                <div style={{ fontSize: 7, width: 32, color: isUp ? 'var(--green)' : 'var(--magenta)', flexShrink: 0 }}>{growth}</div>
              </div>
            );
          })}

          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.1)', borderRadius: 3 }}>
            <div style={{ fontSize: 8, color: 'var(--cyan)', marginBottom: 3 }}>💡 JARVIS INSIGHT</div>
            <div style={{ fontSize: 9, color: '#6070a0', lineHeight: 1.6 }}>
              Generative AI and LLM Agents are surging. Your current profile matches <span style={{ color: 'var(--cyan)' }}>68%</span> of top roles. Focus on <span style={{ color: 'var(--yellow)' }}>DSA</span> and <span style={{ color: 'var(--purple)' }}>System Design</span> to unlock the remaining gap.
            </div>
          </div>
        </div>
      </div>

      {/* Weekly activity heatmap */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--magenta),transparent)', opacity: 0.3 }} />
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--magenta)', letterSpacing: '0.12em', marginBottom: 12 }}>// WEEKLY ACTIVITY · JUNE 2026</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {ACTIVITY.map(({ week, commits, posts, hackathons }) => (
            <div key={week} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border2)', borderRadius: 3, padding: 10 }}>
              <div style={{ fontFamily: 'var(--font-hd)', fontSize: 10, color: 'var(--cyan)', marginBottom: 8, letterSpacing: '0.1em' }}>{week}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 8, color: 'var(--muted)', width: 70 }}>GitHub</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: Math.min(commits, 10) }).map((_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--green)', boxShadow: '0 0 3px rgba(0,255,159,0.4)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 8, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{commits}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 8, color: 'var(--muted)', width: 70 }}>LinkedIn</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: posts }).map((_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--cyan)', boxShadow: '0 0 3px rgba(0,245,255,0.4)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 8, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{posts}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 8, color: 'var(--muted)', width: 70 }}>Hackathons</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: hackathons }).map((_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--magenta)', boxShadow: '0 0 3px rgba(255,45,120,0.4)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 8, color: 'var(--magenta)', fontFamily: 'var(--font-mono)' }}>{hackathons}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}