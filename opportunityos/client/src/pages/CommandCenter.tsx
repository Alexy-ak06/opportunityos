import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { opportunitiesApi, missionApi } from '../lib/api';
import { getSocket } from '../lib/socket';
import { getScoreBand, CATEGORY_META } from '@opportunityos/shared';
import type { Opportunity } from '@opportunityos/shared';
import { formatDistanceToNow } from 'date-fns';

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function CommandCenter() {
  const [topOps, setTopOps] = useState<Opportunity[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch top 5 by ROI
  useEffect(() => {
    opportunitiesApi.list({ sort: 'roi', limit: 5, actionableOnly: true })
      .then(r => setTopOps(r.data.data))
      .catch(console.error);
  }, []);

  // Real-time: new opportunity
  useEffect(() => {
    const socket = getSocket();
    socket.on('opportunity:new', (op: Opportunity) => {
      setToastMsg(`⚡ New: ${op.title}`);
      setTopOps(prev => [op, ...prev].slice(0, 5));
      setTimeout(() => setToastMsg(null), 4000);
    });
    return () => { socket.off('opportunity:new'); };
  }, []);

  const greeting = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div className="p-6 space-y-6 max-w-4xl" {...fadeUp}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, <span className="text-accent-400">Ayush</span> ⚡
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            {' · '}
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-mono">OpportunityOS</div>
          <div className="text-xs text-accent-400 font-mono">Jarvis v1.0</div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Opportunities', value: topOps.length, icon: TrendingUp, color: 'text-accent-400' },
          { label: 'Highest ROI Score',    value: topOps[0]?.currentScore ?? '—', icon: Zap, color: 'text-yellow-400' },
          { label: 'Urgent (≤3 days)',     value: topOps.filter(o => {
            const d = o.dates?.registrationDeadline;
            if (!d) return false;
            return (new Date(d).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000;
          }).length, icon: Clock, color: 'text-red-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <Icon size={20} className={color} />
            <div>
              <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Today's Mission ────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-accent-400" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Today's Mission</h2>
        </div>

        {topOps.length === 0 ? (
          <p className="text-gray-500 text-sm">Loading missions...</p>
        ) : (
          <ol className="space-y-2">
            {topOps.map((op, i) => {
              const band = getScoreBand(op.currentScore);
              const deadline = op.dates?.registrationDeadline ?? op.dates?.submissionDeadline;
              const urgent = deadline && (new Date(deadline).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000;
              return (
                <li key={op._id ?? i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-700 transition-colors group">
                  <Circle size={16} className="text-gray-600 group-hover:text-accent-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{op.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {CATEGORY_META[op.category]?.icon} {CATEGORY_META[op.category]?.label}
                      </span>
                      {deadline && (
                        <span className={urgent ? 'deadline-urgent' : 'deadline-normal'}>
                          · {urgent ? '🔥 ' : ''}{formatDistanceToNow(new Date(deadline), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className="score-badge font-mono shrink-0"
                    style={{ background: band.color + '22', color: band.color, border: `1px solid ${band.color}44` }}
                  >
                    {op.currentScore}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* ── Deadline Strip ─────────────────────────────────────────────── */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white uppercase tracking-widest mb-3">Upcoming Deadlines</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {topOps
            .filter(op => op.dates?.registrationDeadline || op.dates?.submissionDeadline)
            .sort((a, b) => {
              const da = new Date(a.dates.registrationDeadline ?? a.dates.submissionDeadline!).getTime();
              const db = new Date(b.dates.registrationDeadline ?? b.dates.submissionDeadline!).getTime();
              return da - db;
            })
            .map(op => {
              const deadline = op.dates?.registrationDeadline ?? op.dates?.submissionDeadline!;
              const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const color = days <= 1 ? '#ef4444' : days <= 3 ? '#f97316' : days <= 7 ? '#f59e0b' : '#6b7280';
              return (
                <div key={op._id} className="shrink-0 card-sm text-center min-w-[120px]" style={{ borderColor: color + '44' }}>
                  <div className="font-mono text-lg font-bold" style={{ color }}>{days}d</div>
                  <div className="text-xs text-gray-400 mt-1 truncate max-w-[100px]">{op.title.split(' ').slice(0, 3).join(' ')}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 bg-accent-500 text-white px-4 py-2.5 rounded-xl text-sm shadow-xl"
        >
          {toastMsg}
        </motion.div>
      )}

    </motion.div>
  );
}
