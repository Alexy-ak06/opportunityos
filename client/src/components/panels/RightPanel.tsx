import type { Opportunity } from '@opportunityos/shared';
import { CATEGORY_META } from '@opportunityos/shared';

interface Props {
  opportunities: Opportunity[];
  urgentCount: number;
}

const MISSIONS = [
  { text: 'Push GitHub commit',    xp: 30,  done: true  },
  { text: 'Register Flipkart Grid', xp: 50, done: false },
  { text: 'Azure AI-102 Module 1', xp: 75,  done: false },
  { text: 'Post on LinkedIn',      xp: 60,  done: false },
  { text: 'GSSoC webinar',         xp: 40,  done: false },
];

const SKILLS = [
  { name: 'AI/ML',    val: 72, grad: 'linear-gradient(90deg,var(--purple),var(--cyan))'  },
  { name: 'Backend',  val: 65, grad: 'linear-gradient(90deg,var(--cyan),var(--green))'   },
  { name: 'Cloud',    val: 48, grad: 'linear-gradient(90deg,var(--cyan),#0090ff)'        },
  { name: 'DSA',      val: 40, grad: 'var(--magenta)'                                    },
  { name: 'LLM',      val: 68, grad: 'linear-gradient(90deg,var(--purple),var(--magenta))'},
];

const GOODIES = [
  { icon: '👕', title: 'Google Cloud Swag Kit',  meta: 'Top 50 · Hackathon',  badge: 'AVAIL',  color: 'var(--green)'   },
  { icon: '🎒', title: 'MLH Hacker Backpack',    meta: 'MLH Member · Free',   badge: 'CLAIM',  color: 'var(--cyan)'    },
  { icon: '🏅', title: 'Microsoft Learn Badge',  meta: 'AI-102 · LinkedIn',   badge: 'EARN',   color: 'var(--purple)'  },
  { icon: '💻', title: 'GitHub Student Pack',    meta: '$200+ tools · Free',  badge: 'RENEW',  color: 'var(--yellow)'  },
];

const AGENTS = [
  { name: 'Scout',        status: 'SEARCHING', color: 'var(--green)',   type: 'active'   },
  { name: 'Evaluator',    status: 'SCORING',   color: 'var(--yellow)',  type: 'scanning' },
  { name: 'Deadline Guard',status: '32 SET',   color: 'var(--cyan)',    type: 'active'   },
  { name: 'Cert Agent',   status: '3 PICKED',  color: 'var(--purple)',  type: 'ready'    },
  { name: 'Internship',   status: 'FOUND 4',   color: 'var(--green)',   type: 'active'   },
  { name: 'Career Coach', status: 'ANALYZING', color: 'var(--magenta)', type: 'scanning' },
];

const FEED = [
  { time: '01:18', text: 'Lablab.ai new LLM hack',   dotColor: 'var(--green)'   },
  { time: '01:09', text: 'Flipkart Grid open',        dotColor: 'var(--cyan)'    },
  { time: '00:54', text: 'KIIT AI workshop posted',   dotColor: 'var(--yellow)'  },
  { time: '00:41', text: 'Community link verified',   dotColor: 'var(--purple)'  },
  { time: '00:22', text: 'Azure voucher live',        dotColor: 'var(--magenta)' },
];

const MEMORY = ['AI over Web3','Year 1 CSE','Azure focus','Prefers certs','KIIT · Bbsr','Team 1–4','No Web3','GenAI builder'];

const AUTOMATIONS = [
  { label: 'Daily briefing 07:30', on: true  },
  { label: 'Deadline alerts',      on: true  },
  { label: 'Weekly cert picks',    on: true  },
  { label: 'Google Calendar',      on: false },
  { label: 'Reg. checklist',       on: true  },
  { label: 'Discord alerts',       on: false },
];

function PanelTitle({ children, color = 'var(--cyan)' }: { children: string; color?: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-hd)', fontSize: 8, fontWeight: 700,
      color, textShadow: `0 0 8px ${color}60`,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      marginBottom: 7,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(0,245,255,0.06)', margin: '8px 0' }} />;
}

export default function RightPanel({ opportunities, urgentCount }: Props) {
  const earnedXp = MISSIONS.filter(m => m.done).reduce((a, m) => a + m.xp, 0);
  const totalXp  = MISSIONS.reduce((a, m) => a + m.xp, 0);
  const doneCount = MISSIONS.filter(m => m.done).length;

  return (
    <div style={{
      background: 'var(--bg2)',
      borderLeft: '1px solid rgba(0,245,255,0.08)',
      padding: 10,
      display: 'flex', flexDirection: 'column', gap: 0,
      overflowY: 'auto',
    }}>

      {/* ── Today's Mission ── */}
      <PanelTitle color="var(--cyan)">// Today's mission</PanelTitle>
      {MISSIONS.map(({ text, xp, done }, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div className={`mission-check ${done ? 'done' : ''}`}>
            {done && <span style={{ fontSize: 7, color: 'var(--green)', textShadow: '0 0 6px var(--green)' }}>✓</span>}
          </div>
          <div style={{ fontSize: 9, color: done ? 'var(--muted)' : 'var(--text)', flex: 1, textDecoration: done ? 'line-through' : 'none' }}>{text}</div>
          <div style={{ fontSize: 8, color: 'var(--purple)', fontFamily: 'var(--font-mono)', textShadow: '0 0 6px rgba(180,77,255,0.4)' }}>+{xp}XP</div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 5, borderTop: '1px solid rgba(0,245,255,0.06)' }}>
        <div style={{ fontSize: 8, color: 'var(--muted)' }}>{doneCount}/5 · 🔥7d</div>
        <div style={{ fontSize: 9, color: 'var(--purple)', fontFamily: 'var(--font-mono)', textShadow: '0 0 8px rgba(180,77,255,0.5)' }}>{earnedXp}/{totalXp} XP</div>
      </div>

      <Divider />

      {/* ── Career Progress ── */}
      <PanelTitle color="var(--purple)">// Career progress</PanelTitle>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#b44dff" />
            </linearGradient>
          </defs>
          <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
          <circle cx="35" cy="35" r="28" fill="none" stroke="url(#rg)" strokeWidth="5"
            strokeDasharray="176" strokeDashoffset="76"
            strokeLinecap="round" transform="rotate(-90 35 35)"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.5))' }} />
          <text x="35" y="31" textAnchor="middle" fill="#00f5ff" fontSize="11"
            fontFamily="Orbitron,monospace" fontWeight="900"
            style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.8))' }}>58%</text>
          <text x="35" y="42" textAnchor="middle" fill="#2a2a60" fontSize="6" fontFamily="Share Tech Mono,monospace">SWE 2029</text>
        </svg>
      </div>
      {SKILLS.map(({ name, val, grad }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <div style={{ fontSize: 8, color: '#44506a', width: 52, flexShrink: 0 }}>{name}</div>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${val}%`, background: grad, borderRadius: 1 }} />
          </div>
          <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 20, textAlign: 'right' }}>{val}</div>
        </div>
      ))}

      <Divider />

      {/* ── Goodies ── */}
      <PanelTitle color="var(--yellow)">// Goodies this week 🎁</PanelTitle>
      {GOODIES.map(({ icon, title, meta, badge, color }) => (
        <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{meta}</div>
          </div>
          <div style={{
            fontSize: 7, padding: '1px 5px', borderRadius: 2, flexShrink: 0,
            border: `1px solid ${color}30`, background: `${color}08`, color,
            letterSpacing: '0.05em',
          }}>{badge}</div>
        </div>
      ))}

      <Divider />

      {/* ── Personal Memory ── */}
      <PanelTitle color="var(--magenta)">// Personal memory</PanelTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
        {MEMORY.map(tag => (
          <div key={tag} style={{
            background: 'rgba(0,245,255,0.03)',
            border: '1px solid rgba(0,245,255,0.08)',
            borderRadius: 2, padding: '2px 5px',
            fontSize: 8, color: '#6070a0', letterSpacing: '0.05em',
          }}>{tag}</div>
        ))}
      </div>

      <Divider />

      {/* ── AI Agents ── */}
      <PanelTitle color="var(--green)">// AI agents</PanelTitle>
      {AGENTS.map(({ name, status, color, type }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
          <div className={`agent-dot ${type}`} style={{
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }} />
          <div style={{ fontSize: 9, color: '#6070a0', flex: 1 }}>{name}</div>
          <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color, textShadow: `0 0 6px ${color}60` }}>{status}</div>
        </div>
      ))}

      <Divider />

      {/* ── Automation ── */}
      <PanelTitle color="var(--cyan)">// Automation</PanelTitle>
      {AUTOMATIONS.map(({ label, on }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
          <div className={`cp-toggle ${on ? 'on' : ''}`}>
            <div className="cp-toggle-knob" />
          </div>
          <div style={{ fontSize: 9, color: '#6070a0' }}>{label}</div>
        </div>
      ))}

      <Divider />

      {/* ── Live Feed ── */}
      <PanelTitle color="var(--magenta)">// Live feed</PanelTitle>
      {FEED.map(({ time, text, dotColor }) => (
        <div key={time} style={{ display: 'flex', gap: 6, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-mono)', width: 32, flexShrink: 0, marginTop: 1 }}>{time}</div>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: dotColor, boxShadow: `0 0 5px ${dotColor}`, marginTop: 3, flexShrink: 0 }} />
          <div style={{ fontSize: 9, color: '#44506a', flex: 1, lineHeight: 1.4 }}>{text}</div>
        </div>
      ))}

      <Divider />

      {/* ── Notifications ── */}
      <PanelTitle color="var(--yellow)">// Notifications</PanelTitle>
      {[
        { text: 'Flipkart Grid — 3 days', time: '3 min ago',  dotColor: 'var(--magenta)' },
        { text: 'Lablab.ai hack found',   time: '18 min ago', dotColor: 'var(--purple)'  },
        { text: 'Community link verified',time: '41 min ago', dotColor: 'var(--green)'   },
        { text: 'Scores recomputed (6)',  time: '1h ago',     dotColor: 'var(--cyan)'    },
      ].map(({ text, time, dotColor }) => (
        <div key={text} style={{ display: 'flex', gap: 6, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, boxShadow: `0 0 5px ${dotColor}`, marginTop: 3, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: 'var(--text)' }}>{text}</div>
            <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{time}</div>
          </div>
        </div>
      ))}

    </div>
  );
}