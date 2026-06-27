import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Zap, Target, Trophy, Settings, Wifi, WifiOff
} from 'lucide-react';
import { getSocket } from './lib/socket';
import CommandCenter from './pages/CommandCenter';
import OpportunityFeed from './pages/OpportunityFeed';
import GoalsPage from './pages/Goals';

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => { socket.off('connect'); socket.off('disconnect'); };
  }, []);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-surface-900 overflow-hidden">

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="w-56 bg-surface-800 border-r border-surface-600 flex flex-col shrink-0">

          {/* Logo */}
          <div className="p-4 border-b border-surface-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center glow-accent">
                <Zap size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-none">OpportunityOS</div>
                <div className="text-xs text-gray-500 mt-0.5 font-mono">v1.0 · Jarvis</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-2 space-y-0.5">
            {[
              { to: '/',             icon: LayoutDashboard, label: 'Command Center' },
              { to: '/opportunities',icon: Trophy,          label: 'Opportunities'  },
              { to: '/goals',        icon: Target,          label: 'Career GPS'     },
            ].map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-surface-700'
                  }`
                }
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Connection status */}
          <div className="p-3 border-t border-surface-600">
            <div className={`flex items-center gap-2 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
              {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span className="font-mono">{connected ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/"              element={<CommandCenter />} />
              <Route path="/opportunities" element={<OpportunityFeed />} />
              <Route path="/goals"         element={<GoalsPage />} />
            </Routes>
          </AnimatePresence>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
