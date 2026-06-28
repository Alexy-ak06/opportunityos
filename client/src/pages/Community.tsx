import { useState } from 'react';

const SUBMITTED = [
  { title: 'KIIT Hackfest 2026', source: 'WhatsApp', submitter: 'Rahul K', status: 'VERIFIED', time: '2h ago', color: 'var(--green)' },
  { title: 'NIT Rourkela AI Sprint', source: 'LinkedIn', submitter: 'Priya M', status: 'PENDING', time: '5h ago', color: 'var(--yellow)' },
  { title: 'IIT BBS Datathon', source: 'Discord', submitter: 'Arun S', status: 'VERIFIED', time: '1d ago', color: 'var(--green)' },
  { title: 'SRM GenAI Challenge', source: 'Telegram', submitter: 'Neha R', status: 'REVIEWING', time: '1d ago', color: 'var(--cyan)' },
  { title: 'VSSUT Hackathon', source: 'WhatsApp', submitter: 'Raj P', status: 'VERIFIED', time: '2d ago', color: 'var(--green)' },
];

const SOURCES = [
  { name: 'WhatsApp Groups', desc: 'College tech communities', icon: '💬', count: 12, color: 'var(--green)'   },
  { name: 'LinkedIn Posts',  desc: 'Campus ambassadors',       icon: '💼', count: 8,  color: 'var(--cyan)'    },
  { name: 'Discord Servers', desc: 'Developer communities',    icon: '🎮', count: 6,  color: 'var(--purple)'  },
  { name: 'Telegram Channels',desc: 'Tech news channels',      icon: '✈️', count: 5,  color: 'var(--yellow)'  },
  { name: 'X / Twitter',     desc: 'Dev spaces & threads',     icon: '🐦', count: 4,  color: 'var(--magenta)' },
  { name: 'College Portals', desc: 'KIIT, NIT, IIT feeds',     icon: '🎓', count: 9,  color: 'var(--green)'   },
];

const LEADERBOARD = [
  { rank: 1, name: 'Rahul K',  college: 'KIIT',        submissions: 8, verified: 7, badge: '🏆' },
  { rank: 2, name: 'Priya M',  college: 'NIT Rourkela', submissions: 6, verified: 5, badge: '🥈' },
  { rank: 3, name: 'Arun S',   college: 'IIT BBS',      submissions: 5, verified: 5, badge: '🥉' },
  { rank: 4, name: 'Neha R',   college: 'VSSUT',        submissions: 4, verified: 3, badge: '⭐' },
  { rank: 5, name: 'Ayush M',  college: 'KIIT',         submissions: 3, verified: 2, badge: '⭐' },
];

const ALERTS = [
  { title: 'IIT Bombay Techfest 2026',   deadline: 'Jul 15', type: 'EXCLUSIVE', color: 'var(--magenta)' },
  { title: 'Google DSC Solutions Challenge', deadline: 'Jul 20', type: 'COMMUNITY', color: 'var(--cyan)'    },
  { title: 'Microsoft Imagine Cup India',    deadline: 'Aug 1',  type: 'EXCLUSIVE', color: 'var(--purple)'  },
  { title: 'Flipkart Runway Program',        deadline: 'Aug 10', type: 'COMMUNITY', color: 'var(--green)'   },
];

export default function Community() {
  const [url, setUrl]     = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('whatsapp');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setUrl(''); setTitle(''); }, 3000);
  };

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono)' }}>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 14, fontWeight: 900, color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)', letterSpacing: '0.15em' }}>
          // COMMUNITY INTEL
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.08em' }}>
          CROWDSOURCED OPPORTUNITIES · HIDDEN GEMS · CAMPUS NETWORK
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
        {[
          { val: '35', label: 'Links submitted', color: 'var(--cyan)'    },
          { val: '28', label: 'Verified',         color: 'var(--green)'   },
          { val: '142', label: 'Subscribers',      color: 'var(--purple)'  },
          { val: '12', label: 'Exclusive finds',   color: 'var(--magenta)' },
        ].map(({ val, label, color }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 3, padding: '10px 12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: color, opacity: 0.6 }} />
            <div style={{ fontFamily: 'var(--font-hd)', fontSize: 22, fontWeight: 900, color, textShadow: `0 0 15px ${color}80` }}>{val}</div>
            <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

        {/* Submit form */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(0,245,255,0.03),rgba(180,77,255,0.03))',
          border: '1px solid rgba(0,245,255,0.15)',
          borderRadius: 4, padding: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent)' }} />

          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 9, color: 'var(--cyan)', letterSpacing: '0.12em', marginBottom: 12, textShadow: '0 0 8px rgba(0,245,255,0.5)' }}>
            // SUBMIT A HIDDEN OPPORTUNITY
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
            Found a hackathon on <span style={{ color: '#7a8aaa' }}>WhatsApp</span>, <span style={{ color: '#7a8aaa' }}>LinkedIn</span>, or a college group?
            Submit it — Jarvis verifies and alerts <span style={{ color: 'var(--cyan)' }}>142 subscribers</span>.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Opportunity title..."
              style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 3, padding: '7px 10px', color: 'var(--text)', fontSize: 10, fontFamily: 'var(--font-mono)', outline: 'none', width: '100%' }} />

            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Registration URL or link..."
              style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 3, padding: '7px 10px', color: 'var(--text)', fontSize: 10, fontFamily: 'var(--font-mono)', outline: 'none', width: '100%' }} />

            <select value={source} onChange={e => setSource(e.target.value)}
              style={{ background: 'var(--bg2)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 3, padding: '7px 10px', color: 'var(--text)', fontSize: 10, fontFamily: 'var(--font-mono)', outline: 'none' }}>
              <option value="whatsapp">WhatsApp Group</option>
              <option value="linkedin">LinkedIn Post</option>
              <option value="discord">Discord Server</option>
              <option value="telegram">Telegram Channel</option>
              <option value="twitter">X / Twitter</option>
              <option value="other">Other</option>
            </select>

            <button onClick={handleSubmit} style={{
              background: submitted ? 'rgba(0,255,159,0.15)' : 'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(180,77,255,0.15))',
              border: `1px solid ${submitted ? 'rgba(0,255,159,0.4)' : 'rgba(0,245,255,0.4)'}`,
              borderRadius: 3, padding: '8px 14px',
              fontFamily: 'var(--font-hd)', fontSize: 9, fontWeight: 700,
              color: submitted ? 'var(--green)' : 'var(--cyan)',
              cursor: 'pointer', letterSpacing: '0.1em',
              textShadow: submitted ? '0 0 8px rgba(0,255,159,0.5)' : '0 0 8px rgba(0,245,255,0.5)',
              transition: 'all 0.3s',
            }}>
              {submitted ? '✓ SUBMITTED — PENDING REVIEW' : '+ SUBMIT LINK'}
            </button>
          </div>
        </div>

        {/* Recent submissions */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--green),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--green)', letterSpacing: '0.12em', marginBottom: 10 }}>// RECENT SUBMISSIONS</div>

          {SUBMITTED.map(({ title, source, submitter, status, time, color }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{source} · {submitter} · {time}</div>
              </div>
              <div style={{ fontSize: 7, padding: '2px 6px', borderRadius: 2, border: `1px solid ${color}30`, background: `${color}08`, color, letterSpacing: '0.06em', flexShrink: 0 }}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

        {/* Exclusive alerts */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--magenta),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--magenta)', letterSpacing: '0.12em', marginBottom: 10 }}>// EXCLUSIVE COMMUNITY ALERTS</div>

          {ALERTS.map(({ title, deadline, type, color }) => (
            <div key={title} style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${color}15`, borderRadius: 3, padding: 10, marginBottom: 6, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: 0.3 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text)', fontWeight: 600, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 8, color: 'var(--muted)' }}>Deadline: <span style={{ color: 'var(--yellow)' }}>{deadline}</span></div>
                </div>
                <div style={{ fontSize: 7, padding: '2px 6px', borderRadius: 2, border: `1px solid ${color}30`, background: `${color}08`, color, letterSpacing: '0.06em', flexShrink: 0 }}>
                  {type}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--yellow),transparent)', opacity: 0.4 }} />
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--yellow)', letterSpacing: '0.12em', marginBottom: 10 }}>// TOP CONTRIBUTORS</div>

          {LEADERBOARD.map(({ rank, name, college, submissions, verified, badge }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: 14, flexShrink: 0 }}>{badge}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: name === 'Ayush M' ? 'var(--cyan)' : 'var(--text)', fontWeight: 600, textShadow: name === 'Ayush M' ? '0 0 8px rgba(0,245,255,0.4)' : 'none' }}>{name}</div>
                <div style={{ fontSize: 8, color: 'var(--muted)' }}>{college}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'var(--font-hd)', fontWeight: 700 }}>{verified}</div>
                <div style={{ fontSize: 7, color: 'var(--muted)' }}>{submissions} submitted</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source network */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--purple),transparent)', opacity: 0.3 }} />
        <div style={{ fontFamily: 'var(--font-hd)', fontSize: 8, color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: 10 }}>// COMMUNITY SOURCE NETWORK</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {SOURCES.map(({ name, desc, icon, count, color }) => (
            <div key={name} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border2)', borderRadius: 3, padding: 10, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, color: 'var(--text)', fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{desc}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-hd)', fontSize: 14, fontWeight: 900, color, textShadow: `0 0 8px ${color}60`, flexShrink: 0 }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}