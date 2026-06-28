import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSocket } from './lib/socket';
import CommandCenter from './pages/CommandCenter';
import OpportunityFeed from './pages/OpportunityFeed';
import GoalsPage from './pages/Goals';
import DeadlineToast from './components/panels/DeadlineToast';

const NAV = [
  { to: '/',              icon: '⌘', label: 'Command Center' },
  { to: '/opportunities', icon: '◈', label: 'Opportunities'  },
  { to: '/goals',         icon: '◎', label: 'Career GPS'     },
  { to: '/analytics',     icon: '▦', label: 'Analytics'      },
  { to: '/community',     icon: '👥', label: 'Community'     },
  { to: '/automation',    icon: '⚙', label: 'Automation'     },
];

export default function App() {
  const [connected, setConnected] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const s = getSocket();
    s.on('connect',    () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    return () => { s.off('connect'); s.off('disconnect'); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit',
  }).toUpperCase();

  return (
    <BrowserRouter>
      <div style={{
        display: 'grid', gridTemplateColumns: '46px 1fr',
        height: '100vh', background: 'var(--bg)', overflow: 'hidden',
        fontFamily: 'var(--font-mono)',
      }}>

        {/* ── Sidebar ── */}
        <aside style={{
          background: 'var(--bg2)',
          borderRight: '1px solid rgba(0,245,255,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '10px 0', gap: 4,
          boxShadow: '2px 0 20px rgba(0,245,255,0.05)',
        }}>
          {/* Logo */}
          <div style={{
            width: 30, height: 30, borderRadius: 4, marginBottom: 10,
            background: 'linear-gradient(135deg,rgba(0,245,255,0.2),rgba(180,77,255,0.2))',
            border: '1px solid rgba(0,245,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0,245,255,0.25)',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}>
              <path d="M8 1L15 13H1Z" fill="rgba(0,245,255,0.9)"
                style={{ filter: 'drop-shadow(0 0 3px rgba(0,245,255,0.8))' }} />
            </svg>
          </div>

          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} title={label}
              style={({ isActive }) => ({
                width: 32, height: 32, borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, cursor: 'pointer', textDecoration: 'none',
                border: '1px solid',
                transition: 'all 0.2s',
                color:       isActive ? 'var(--cyan)'              : 'var(--muted)',
                borderColor: isActive ? 'rgba(0,245,255,0.25)'     : 'transparent',
                background:  isActive ? 'rgba(0,245,255,0.08)'     : 'transparent',
                boxShadow:   isActive ? '0 0 12px rgba(0,245,255,0.15)' : 'none',
                textShadow:  isActive ? '0 0 8px rgba(0,245,255,0.6)'   : 'none',
              })}
            >{icon}</NavLink>
          ))}

          <div style={{ flex: 1 }} />

          {/* Settings */}
          <div style={{
            width: 32, height: 32, borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, cursor: 'pointer', color: 'var(--muted)',
            border: '1px solid transparent', transition: 'all 0.2s',
          }}>✦</div>

          {/* Connection dot */}
          <div style={{ marginTop: 4, marginBottom: 4 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: connected ? 'var(--green)' : 'var(--magenta)',
              boxShadow: connected
                ? '0 0 8px var(--green), 0 0 16px rgba(0,255,159,0.3)'
                : '0 0 8px var(--magenta)',
              animation: 'neon-pulse 1.5s infinite',
            }} title={connected ? 'Live' : 'Offline'} />
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Topbar */}
          <header style={{
            height: 38, background: 'var(--bg2)',
            borderBottom: '1px solid rgba(0,245,255,0.12)',
            display: 'flex', alignItems: 'center',
            padding: '0 14px', gap: 10, flexShrink: 0,
            boxShadow: '0 1px 30px rgba(0,245,255,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Bottom shimmer */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(0,245,255,0.3),transparent)',
            }} />

            {/* Brand */}
            <div style={{
              fontFamily: 'var(--font-hd)', fontSize: 11,
              fontWeight: 900, letterSpacing: '0.18em', whiteSpace: 'nowrap',
            }}>
              <span style={{
                color: 'var(--cyan)',
                textShadow: '0 0 20px rgba(0,245,255,0.8), 0 0 40px rgba(0,245,255,0.3)',
              }}>OPPORTUNITY</span>
              <span style={{
                color: 'var(--magenta)',
                textShadow: '0 0 20px rgba(255,45,120,0.8), 0 0 40px rgba(255,45,120,0.3)',
              }}>OS</span>
            </div>

            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: connected ? 'var(--green)' : 'var(--magenta)',
                boxShadow: connected ? '0 0 8px var(--green)' : '0 0 8px var(--magenta)',
                animation: 'neon-pulse 1.5s infinite',
              }} />
              <span style={{
                fontSize: 9, letterSpacing: '0.12em',
                color: connected ? 'var(--green)' : 'var(--magenta)',
                textShadow: connected ? '0 0 8px var(--green)' : '0 0 8px var(--magenta)',
              }}>{connected ? 'LIVE' : 'OFFLINE'}</span>
            </div>

            {/* Search bar */}
            <div style={{
              flex: 1, maxWidth: 300,
              background: 'rgba(0,245,255,0.03)',
              border: '1px solid rgba(0,245,255,0.12)',
              borderRadius: 3, padding: '4px 10px',
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,245,255,0.12)')}
            >
              <span style={{ color: 'var(--cyan)', textShadow: '0 0 6px rgba(0,245,255,0.5)', fontSize: 12 }}>⌕</span>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>SEARCH MATRIX...</span>
              <div style={{ flex: 1 }} />
              <span style={{
                background: 'rgba(0,245,255,0.05)',
                border: '1px solid rgba(0,245,255,0.15)',
                borderRadius: 2, padding: '1px 4px',
                fontSize: 8, color: 'var(--muted)',
              }}>⌘K</span>
            </div>

            <div style={{ flex: 1 }} />

            {/* Clock */}
            <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
              {dateStr} ·{' '}
              <span style={{ color: 'var(--cyan)', textShadow: '0 0 6px rgba(0,245,255,0.5)' }}>
                {timeStr}
              </span>{' '}IST
            </div>

            {/* Avatar */}
            <div style={{
              width: 24, height: 24, borderRadius: 3, flexShrink: 0,
              background: 'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(180,77,255,0.15))',
              border: '1px solid rgba(0,245,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-hd)', fontSize: 10, fontWeight: 900,
              color: 'var(--cyan)',
              textShadow: '0 0 10px rgba(0,245,255,0.8)',
              boxShadow: '0 0 12px rgba(0,245,255,0.2)',
              cursor: 'pointer',
            }}>A</div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/"              element={<CommandCenter />} />
              <Route path="/opportunities" element={<OpportunityFeed />} />
              <Route path="/goals"         element={<GoalsPage />} />
              <Route path="/analytics"     element={<PlaceholderPage title="ANALYTICS" />} />
              <Route path="/community"     element={<PlaceholderPage title="COMMUNITY" />} />
              <Route path="/automation"    element={<PlaceholderPage title="AUTOMATION" />} />
            </Routes>
          </main>
        </div>
      </div>
      <DeadlineToast />
    </BrowserRouter>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', flexDirection: 'column', gap: 12,
    }}>
      <div style={{
        fontFamily: 'var(--font-hd)', fontSize: 24, fontWeight: 900,
        color: 'var(--cyan)', textShadow: '0 0 30px rgba(0,245,255,0.6)',
        letterSpacing: '0.2em',
      }}>{title}</div>
      <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em' }}>
        COMING NEXT PHASE
      </div>
    </div>
  );
}