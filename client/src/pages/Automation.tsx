import { useState } from 'react';

const AUTOMATIONS = [
  {
    id: 'briefing',
    title: 'Daily Morning Briefing',
    desc: 'AI-generated briefing every day at 07:30 IST with top opportunities, deadlines, and today\'s mission',
    icon: '🌅',
    on: true,
    category: 'NOTIFICATIONS',
    color: 'var(--cyan)',
    config: '07:30 IST · Email',
  },
  {
    id: 'deadline',
    title: 'Deadline Guardian Alerts',
    desc: 'Fires alerts at 7d, 5d, 3d, 24h before every tracked deadline. Never miss a registration again',
    icon: '⏰',
    on: true,
    category: 'NOTIFICATIONS',
    color: 'var(--magenta)',
    config: '7d · 5d · 3d · 24h',
  },
  {
    id: 'weekly',
    title: 'Weekly Cert Recommendations',
    desc: 'Every Sunday, Jarvis picks 3 certifications aligned with your current goals and skill gaps',
    icon: '🎓',
    on: true,
    category: 'INTELLIGENCE',
    color: 'var(--purple)',
    config: 'Every Sunday',
  },
  {
    id: 'score',
    title: 'Hourly ROI Score Recompute',
    desc: 'Opportunity scores update every hour based on deadline urgency, your profile, and market demand',
    icon: '⚡',
    on: true,
    category: 'INTELLIGENCE',
    color: 'var(--yellow)',
    config: 'Every 60 minutes',
  },
  {
    id: 'checklist',
    title: 'Registration Checklist',
    desc: 'When you register for an opportunity, auto-generate a checklist of next steps and submission requirements',
    icon: '✅',
    on: true,
    category: 'PRODUCTIVITY',
    color: 'var(--green)',
    config: 'On registration',
  },
  {
    id: 'calendar',
    title: 'Google Calendar Sync',
    desc: 'Auto-add hackathon dates, submission deadlines, and events to your Google Calendar',
    icon: '📅',
    on: false,
    category: 'INTEGRATIONS',
    color: 'var(--cyan)',
    config: 'Connect Google',
  },
  {
    id: 'discord',
    title: 'Discord Notifications',
    desc: 'Send deadline alerts and new opportunity pings to your Discord server or DM',
    icon: '🎮',
    on: false,
    category: 'INTEGRATIONS',
    color: 'var(--purple)',
    config: 'Connect Discord',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Post Suggestions',
    desc: 'After completing a hackathon or earning a cert, Jarvis drafts a LinkedIn post for you to review and publish',
    icon: '💼',
    on: false,
    category: 'PRODUCTIVITY',
    color: 'var(--cyan)',
    config: 'On completion',
  },
  {
    id: 'community',
    title: 'Community Link Verification',
    desc: 'When someone submits a hidden opportunity link, run BullMQ verification and alert you for one-click approval',
    icon: '🔗',
    on: true,
    category: 'COMMUNITY',
    color: 'var(--green)',
    config: 'Instant · BullMQ',
  },
  {
    id: 'scraper',
    title: 'Auto Web Scraper',
    desc: 'Scout agent scans Devpost, Unstop, MLH, Lablab.ai, HackerEarth every 6 hours for new opportunities',
    icon: '🤖',
    on: false,
    category: 'INTELLIGENCE',
    color: 'var(--magenta)',
    config: 'Every 6 hours · Phase 2',
  },
  {
    id: 'expiry',
    title: 'Auto-Expire Old Opportunities',
    desc: 'Opportunities past their final deadline automatically move to expired status and leave your active feed',
    icon: '🗑️',
    on: true,
    category: 'INTELLIGENCE',
    color: 'var(--muted)',
    config: 'Hourly check',
  },
  {
    id: 'xp',
    title: 'XP & Streak Tracking',
    desc: 'Earn XP for every completed mission item. Maintain streaks to unlock achievement badges',
    icon: '🏆',
    on: true,
    category: 'PRODUCTIVITY',
    color: 'var(--yellow)',
    config: 'Always active',
  },
];

const LOGS = [
  { time: '07:30', event: 'Morning briefing sent', status: 'SUCCESS', color: 'var(--green)'   },
  { time: '01:18', event: 'Lablab.ai new LLM hack found', status: 'SUCCESS', color: 'var(--green)'   },
  { time: '01:09', event: 'Flipkart Grid 3d alert fired', status: 'SUCCESS', color: 'var(--green)'   },
  { time: '00:54', event: 'Community link submitted', status: 'PENDING', color: 'var(--yellow)'  },
  { time: '00:41', event: 'ROI scores recomputed (6)', status: 'SUCCESS', color: 'var(--green)'   },
  { time: '00:22', event: 'GSSoC 7d alert scheduled', status: 'SUCCESS', color: 'var(--green)'   },
  { time: '00:00', event: 'Daily mission generated', status: 'SUCCESS', color: 'var(--green)'   },
];

const CATEGORIES = ['ALL', 'NOTIFICATIONS', 'INTELLIGENCE', 'PRODUCTIVITY', 'INTEGRATIONS', 'COMMUNITY'];

export default function Automation() {
  const [automations, setAutomations] = useState(AUTOMATIONS);
  const [filter, setFilter] = useState('ALL');
  const [briefingTime, setBriefingTime] = useState('07:30');

  const toggle = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, on: !a.on } : a));
  };

  const filtered = filter === 'ALL' ? automations : automations.filter(a => a.category === filter);
  const activeCount = automations.filter(a => a.on).length;

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono)' }}>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 14, fontWeight: 900, color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)', letterSpacing: '0.15em' }}>
          // AUTOMATION CENTER
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.08em' }}>
          JARVIS RUNS {activeCount} AUTOMATIONS ON YOUR BEHALF · 24/7
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
        {[
          { val: `${activeCount}`,                    label: 'Active automations', color: 'var(--cyan)'    },
          { val: `${automations.length - activeCount}`, label: 'Available to enable', color: 'var(--muted)'   },
          { val: '847',                               label: 'Jobs run this month',  color: 'var(--green)'   },
          { val: '0',                                 label: 'Failed jobs',          color: 'var(--purple)'  },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 3, padding: '10px 12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: color, opacity: 0.6 }} />
            <div style={{ fontFamily: 'var(--font-hd)', fontSize: 22, fontWeight: 900, color, textShadow: `0 0 15px ${color}80` }}>{val}</div>
            <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Briefing time config */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(0,245,255,0.03),rgba(180,77,255,0.03))',
        border: '1px solid rgba(0,245,255,0.15)',
        borderRadius: 4, padding: 12, marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent)' }} />
        <div style={{ fontSize: 24, flexShrink: 0 }}>🌅</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 9, color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: 3 }}>MORNING BRIEFING TIME</div>
          <div style={{ fontSize: 9, color: 'var(--muted)' }}>Jarvis wakes up and sends your daily briefing at this time every day</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="time" value={briefingTime} onChange={e => setBriefingTime(e.target.value)}
            style={{
              background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.25)',
              borderRadius: 3, padding: '6px 10px',
              color: 'var(--cyan)', fontSize: 14, fontFamily: 'var(--font-hd)', fontWeight: 700,
              outline: 'none', letterSpacing: '0.1em',
              textShadow: '0 0 8px rgba(0,245,255,0.5)',
            }} />
          <div style={{ fontSize: 9, color: 'var(--muted)' }}>IST</div>
        </div>
        <button style={{
          background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: 3, padding: '7px 14px',
          fontFamily: 'var(--font-hd)', fontSize: 9, fontWeight: 700,
          color: 'var(--cyan)', cursor: 'pointer', letterSpacing: '0.08em',
          textShadow: '0 0 8px rgba(0,245,255,0.5)',
        }}>SAVE</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '4px 10px', borderRadius: 2, fontSize: 8,
            fontFamily: 'var(--font-mono)', cursor: 'pointer', letterSpacing: '0.06em',
            border: `1px solid ${filter === cat ? 'rgba(0,245,255,0.4)' : 'var(--border2)'}`,
            background: filter === cat ? 'rgba(0,245,255,0.08)' : 'transparent',
            color: filter === cat ? 'var(--cyan)' : 'var(--muted)',
            textShadow: filter === cat ? '0 0 8px rgba(0,245,255,0.5)' : 'none',
            transition: 'all 0.2s',
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 8 }}>

        {/* Automation cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(({ id, title, desc, icon, on, category, color, config }) => (
            <div key={id} style={{
              background: on ? `${color}05` : 'var(--bg2)',
              border: `1px solid ${on ? color + '20' : 'var(--border2)'}`,
              borderRadius: 3, padding: 12,
              display: 'flex', alignItems: 'flex-start', gap: 12,
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}>
              {on && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: 0.4 }} />}

              <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 10, color: on ? 'var(--text)' : '#4a4a6a', fontWeight: 600 }}>{title}</div>
                  <div style={{ fontSize: 7, padding: '1px 5px', borderRadius: 2, border: `1px solid ${color}25`, background: `${color}08`, color, letterSpacing: '0.06em' }}>{category}</div>
                </div>
                <div style={{ fontSize: 9, color: on ? '#6070a0' : '#2a2a50', lineHeight: 1.6, marginBottom: 6 }}>{desc}</div>
                <div style={{ fontSize: 8, color: on ? color : 'var(--muted)', fontFamily: 'var(--font-mono)', textShadow: on ? `0 0 6px ${color}60` : 'none' }}>
                  ⚙ {config}
                </div>
              </div>

              {/* Toggle */}
              <div onClick={() => toggle(id)} style={{
                width: 36, height: 18, borderRadius: 9, flexShrink: 0,
                background: on ? `${color}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${on ? color + '50' : 'var(--border2)'}`,
                cursor: 'pointer', position: 'relative', transition: 'all 0.3s',
                boxShadow: on ? `0 0 10px ${color}30` : 'none',
                marginTop: 2,
              }}>
                <div style={{
                  position: 'absolute', width: 12, height: 12, borderRadius: '50%',
                  top: 2, left: on ? 20 : 2,
                  background: on ? color : 'var(--muted)',
                  boxShadow: on ? `0 0 6px ${color}` : 'none',
                  transition: 'all 0.3s',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Activity log */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--green),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--green)', letterSpacing: '0.12em', marginBottom: 10 }}>// AUTOMATION LOG</div>

          {LOGS.map(({ time, event, status, color }) => (
            <div key={time + event} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-mono)', width: 32, flexShrink: 0, marginTop: 1 }}>{time}</div>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}`, marginTop: 3, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: '#7a8aaa', lineHeight: 1.4 }}>{event}</div>
                <div style={{ fontSize: 7, color, marginTop: 1, letterSpacing: '0.05em' }}>{status}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(0,255,159,0.03)', border: '1px solid rgba(0,255,159,0.1)', borderRadius: 3 }}>
            <div style={{ fontSize: 8, color: 'var(--green)', marginBottom: 2 }}>SYSTEM STATUS</div>
            <div style={{ fontSize: 9, color: '#6070a0' }}>
              All systems <span style={{ color: 'var(--green)' }}>operational</span>.<br />
              BullMQ: <span style={{ color: 'var(--green)' }}>32 jobs queued</span>.<br />
              Redis: <span style={{ color: 'var(--green)' }}>connected</span>.<br />
              MongoDB: <span style={{ color: 'var(--green)' }}>connected</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}