import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ExternalLink } from 'lucide-react';
import { opportunitiesApi } from '../lib/api';
import { getSocket } from '../lib/socket';
import { getScoreBand, CATEGORY_META } from '@opportunityos/shared';
import type { Opportunity, OpportunityStatus } from '@opportunityos/shared';
import { formatDistanceToNow } from 'date-fns';

const STATUS_COLORS: Record<OpportunityStatus, string> = {
  new:         'border-blue-500/40 text-blue-400',
  shortlisted: 'border-yellow-500/40 text-yellow-400',
  registered:  'border-green-500/40 text-green-400',
  in_progress: 'border-purple-500/40 text-purple-400',
  completed:   'border-gray-500/40 text-gray-400',
  skipped:     'border-gray-700/40 text-gray-600',
  expired:     'border-red-900/40 text-red-800',
};

export default function OpportunityFeed() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({ status: '', category: '', sort: 'roi' as const });
  const [loading, setLoading] = useState(true);

  const fetchOps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await opportunitiesApi.list({
        sort: filter.sort,
        status: filter.status || undefined,
        category: filter.category || undefined,
        limit: 50,
      });
      setOpportunities(res.data.data);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchOps(); }, [fetchOps]);

  // Real-time updates
  useEffect(() => {
    const socket = getSocket();
    socket.on('opportunity:new',     (op: Opportunity) => setOpportunities(p => [op, ...p]));
    socket.on('opportunity:updated', (op: Opportunity) => setOpportunities(p => p.map(o => o._id === op._id ? op : o)));
    return () => { socket.off('opportunity:new'); socket.off('opportunity:updated'); };
  }, []);

  const quickAction = async (id: string, status: OpportunityStatus, reason?: string) => {
    await opportunitiesApi.update(id, { status, decisionReason: reason });
    setOpportunities(prev => prev.map(o => o._id === id ? { ...o, status } : o));
  };

  return (
    <motion.div
      className="p-6 space-y-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Opportunity Radar</h1>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{total} total · ranked by ROI</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={14} />
          Add Opportunity
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['roi', 'deadline', 'created'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(f => ({ ...f, sort: s as typeof filter.sort }))}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filter.sort === s ? 'bg-accent-500 text-white' : 'bg-surface-700 text-gray-400 hover:text-white'
            }`}
          >
            {s === 'roi' ? '⚡ ROI' : s === 'deadline' ? '🕐 Deadline' : '🕓 Latest'}
          </button>
        ))}

        <select
          value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
          className="bg-surface-700 text-gray-300 text-xs rounded-lg px-3 py-1 border border-surface-600 font-mono"
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_META).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label}</option>
          ))}
        </select>

        <select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="bg-surface-700 text-gray-300 text-xs rounded-lg px-3 py-1 border border-surface-600 font-mono"
        >
          <option value="">All statuses</option>
          {['new','shortlisted','registered','in_progress','completed','skipped','expired'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse h-20 bg-surface-700" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {opportunities.map((op, i) => {
            const band = getScoreBand(op.currentScore);
            const deadline = op.dates?.registrationDeadline ?? op.dates?.submissionDeadline;
            const daysLeft = deadline
              ? Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;
            const isUrgent = daysLeft !== null && daysLeft <= 3;

            return (
              <motion.div
                key={op._id ?? i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card flex items-center gap-4 hover:border-accent-500/30 transition-all group"
              >
                {/* Rank */}
                <div className="text-xs text-gray-600 font-mono w-5 text-center shrink-0">#{i + 1}</div>

                {/* Score */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold font-mono shrink-0"
                  style={{ background: band.color + '18', color: band.color, border: `1px solid ${band.color}33` }}
                >
                  {op.currentScore}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{op.title}</span>
                    <a href={op.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-accent-400 shrink-0">
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`status-chip ${STATUS_COLORS[op.status]}`}>{op.status}</span>
                    <span className="text-xs text-gray-500">{CATEGORY_META[op.category]?.icon} {op.organizer}</span>
                    {daysLeft !== null && (
                      <span className={isUrgent ? 'deadline-urgent' : 'deadline-normal'}>
                        {isUrgent ? '🔥 ' : ''}{daysLeft}d left
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {op.status === 'new' && (
                    <button
                      onClick={() => quickAction(op._id!, 'shortlisted')}
                      className="text-xs px-2 py-1 rounded bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 transition-colors"
                    >
                      ★ Save
                    </button>
                  )}
                  {['new','shortlisted'].includes(op.status) && (
                    <button
                      onClick={() => quickAction(op._id!, 'registered')}
                      className="text-xs px-2 py-1 rounded bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors"
                    >
                      ✓ Register
                    </button>
                  )}
                  {!['completed','skipped','expired'].includes(op.status) && (
                    <button
                      onClick={() => quickAction(op._id!, 'skipped', 'Not relevant right now')}
                      className="text-xs px-2 py-1 rounded bg-gray-500/15 text-gray-500 hover:bg-gray-500/25 transition-colors"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
