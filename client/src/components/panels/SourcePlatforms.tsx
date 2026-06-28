const SOURCES = [
  { name: 'Devpost',        type: 'Global',    typeColor: 'var(--cyan)',    dotColor: 'var(--green)',   active: true  },
  { name: 'Lablab.ai',      type: 'AI/LLM',    typeColor: 'var(--purple)',  dotColor: 'var(--cyan)',    active: true  },
  { name: 'Unstop',         type: 'India',     typeColor: 'var(--yellow)',  dotColor: 'var(--green)',   active: true  },
  { name: 'MLH',            type: 'Global',    typeColor: 'var(--cyan)',    dotColor: 'var(--green)',   active: true  },
  { name: 'Google Dev',     type: 'Events',    typeColor: 'var(--green)',   dotColor: 'var(--yellow)',  active: false },
  { name: 'HackerEarth',    type: 'India',     typeColor: 'var(--yellow)',  dotColor: 'var(--green)',   active: true  },
  { name: 'Devfolio',       type: 'India',     typeColor: 'var(--yellow)',  dotColor: 'var(--green)',   active: true  },
  { name: 'Inc42 Summit',   type: 'Summit',    typeColor: 'var(--magenta)', dotColor: 'var(--magenta)', active: false },
  { name: 'GSSoC',          type: 'Open Src',  typeColor: 'var(--green)',   dotColor: 'var(--green)',   active: true  },
  { name: 'GIDS',           type: 'Summit',    typeColor: 'var(--magenta)', dotColor: 'var(--yellow)',  active: false },
  { name: 'Global AI Comm', type: 'AI',        typeColor: 'var(--purple)',  dotColor: 'var(--cyan)',    active: true  },
  { name: 'India AI Summit',type: 'Govt',      typeColor: 'var(--purple)',  dotColor: 'var(--purple)',  active: false },
  { name: 'Microsoft Learn',type: 'Cert',      typeColor: 'var(--muted)',   dotColor: 'var(--muted)',   active: false },
  { name: 'GeeksforGeeks',  type: 'Cert',      typeColor: 'var(--muted)',   dotColor: 'var(--muted)',   active: false },
  { name: 'Internshala',    type: 'Intern',    typeColor: 'var(--muted)',   dotColor: 'var(--muted)',   active: false },
  { name: 'KIIT Campus',    type: 'Campus',    typeColor: 'var(--green)',   dotColor: 'var(--green)',   active: true  },
];

const FILTERS = [
  { label: 'INDIAN HIRING', on: true  },
  { label: 'GLOBAL GENAI',  on: true  },
  { label: 'CAMPUS ONLY',   on: false },
  { label: 'AI SUMMITS',    on: false },
  { label: 'WITH SWAG',     on: false },
  { label: 'FREE CERTS',    on: false },
];

export default function SourcePlatforms() {
  return (
    <div className="cp-panel accent-green">
      <div className="cp-title green">
        // Source platforms
        <span className="cp-badge">16 CONNECTED · REAL-TIME SCAN</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
        {SOURCES.map(({ name, type, typeColor, dotColor, active }) => (
          <div key={name} style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border2)',
            borderRadius: 3, padding: '5px 7px',
            display: 'flex', alignItems: 'center', gap: 5,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: dotColor, flexShrink: 0,
              boxShadow: active ? `0 0 6px ${dotColor}` : 'none',
              animation: active ? 'neon-pulse 2s infinite' : 'none',
            }} />
            <div style={{ fontSize: 9, color: '#7a8aaa', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </div>
            <div style={{
              fontSize: 7, padding: '1px 4px', borderRadius: 2,
              border: `1px solid ${typeColor}25`,
              background: `${typeColor}08`,
              color: typeColor, letterSpacing: '0.05em', flexShrink: 0,
            }}>{type}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
        {FILTERS.map(({ label, on }) => (
          <div key={label} style={{
            fontSize: 8, padding: '3px 8px', borderRadius: 2,
            border: `1px solid ${on ? 'rgba(0,245,255,0.35)' : 'var(--border2)'}`,
            background: on ? 'rgba(0,245,255,0.05)' : 'transparent',
            color: on ? 'var(--cyan)' : 'var(--muted)',
            cursor: 'pointer', fontFamily: 'var(--font-mono)',
            textShadow: on ? '0 0 8px rgba(0,245,255,0.4)' : 'none',
            transition: 'all 0.2s',
          }}>
            {on ? '☑' : '☐'} {label}
          </div>
        ))}
      </div>
    </div>
  );
}