import { useEffect, useState, useCallback } from 'react';
import { opportunitiesApi } from '../lib/api';
import { getSocket } from '../lib/socket';
import { CATEGORY_META } from '@opportunityos/shared';
import type { Opportunity, OpportunityStatus } from '@opportunityos/shared';

const STATUS_COLORS: Record<string, string> = {
  new:         'var(--cyan)',
  shortlisted: 'var(--yellow)',
  registered:  'var(--green)',
  in_progress: 'var(--purple)',
  completed:   'var(--muted)',
  skipped:     'var(--muted)',
  expired:     'var(--magenta)',
};

const SORTS = [
  { key: 'roi',      label: '⚡ ROI'      },
  { key: 'deadline', label: '🕐 DEADLINE' },
  { key: 'created',  label: '🕓 LATEST'   },
];

export default function OpportunityFeed() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]       = useState('roi');
  const [category, setCategory] = useState('');
  const [status, setStatus]   = useState('');

  const fetchOps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await opportunitiesApi.list({
        sort: sort as any, limit: 50,
        category: category || undefined,
        status:   status   || undefined,
      });
      setOpportunities(res.data.data);
      setTotal(res.data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [sort, category, status]);

  useEffect(() => { fetchOps(); }, [fetchOps]);

  useEffect(() => {
    const s = getSocket();
    s.on('opportunity:new',     (op: Opportunity) => setOpportunities(p => [op, ...p]));
    s.on('opportunity:updated', (op: Opportunity) => setOpportunities(p => p.map(o => o._id === op._id ? op : o)));
    return () => { s.off('opportunity:new'); s.off('opportunity:updated'); };
  }, []);

  const quickAction = async (id: string, newStatus: string) => {
    try {
      await opportunitiesApi.update(id, { status: newStatus as any });
      setOpportunities(p => p.map(o => o._id === id ? { ...o, status: newStatus as any } : o));
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-mono)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-hd)', fontSize: 14, fontWeight: 900, color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.6)', letterSpacing: '0.15em' }}>
            // OPPORTUNITY RADAR
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 3, letterSpacing: '0.08em' }}>
            {total} TOTAL · RANKED BY {sort.toUpperCase()} · LIVE
          </div>
        </div>
        <button style={{
          background: 'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(180,77,255,0.15))',
          border: '1px solid rgba(0,245,255,0.35)',
          borderRadius: 3, padding: '7px 14px',
          fontFamily: 'var(--font-hd)', fontSize: 9, fontWeight: 700,
          color: 'var(--cyan)', cursor: 'pointer', letterSpacing: '0.1em',
          textShadow: '0 0 8px rgba(0,245,255,0.5)',
          boxShadow: '0 0 15px rgba(0,245,255,0.1)',
        }}>+ ADD OPPORTUNITY</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {SORTS.map(({ key, label }) => (
          <button key={key} onClick={() => setSort(key)} style={{
            padding: '4px 10px', borderRadius: 2, fontSize: 8,
            fontFamily: 'var(--font-mono)', cursor: 'pointer',
            border: `1px solid ${sort === key ? 'rgba(0,245,255,0.4)' : 'var(--border2)'}`,
            background: sort === key ? 'rgba(0,245,255,0.08)' : 'transparent',
            color: sort === key ? 'var(--cyan)' : 'var(--muted)',
            textShadow: sort === key ? '0 0 8px rgba(0,245,255,0.5)' : 'none',
            transition: 'all 0.2s', letterSpacing: '0.05em',
          }}>{label}</button>
        ))}

        <select value={category} onChange={e => setCategory(e.target.value)} style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 2, padding: '4px 8px',
          color: 'var(--muted)', fontSize: 8,
          fontFamily: 'var(--font-mono)', cursor: 'pointer',
          letterSpacing: '0.05em',
        }}>
          <option value="">ALL CATEGORIES</option>
          {Object.entries(CATEGORY_META).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {v.label.toUpperCase()}</option>
          ))}
        </select>

        <select value={status} onChange={e => setStatus(e.target.value)} style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: 2, padding: '4px 8px',
          color: 'var(--muted)', fontSize: 8,
          fontFamily: 'var(--font-mono)', cursor: 'pointer',
          letterSpacing: '0.05em',
        }}>
          <option value="">ALL STATUSES</option>
          {['new','shortlisted','registered','in_progress','completed','skipped','expired'].map(s => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-hd)', letterSpacing: '0.1em', padding: 20 }}>
          SCANNING MATRIX...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {opportunities.map((op, i) => {
            const reg = op.dates?.registrationDeadline ?? op.dates?.submissionDeadline;
            const daysLeft = reg ? Math.ceil((new Date(reg).getTime() - Date.now()) / 86400000) : null;
            const isUrgent = daysLeft !== null && daysLeft <= 3;
            const isHot    = daysLeft !== null && daysLeft <= 7;
            const scoreColor = op.currentScore >= 90 ? 'var(--green)'
              : op.currentScore >= 70 ? 'var(--cyan)'
              : op.currentScore >= 50 ? 'var(--yellow)'
              : 'var(--magenta)';
            const deadlineColor = isUrgent ? 'var(--magenta)' : isHot ? 'var(--yellow)' : 'var(--muted)';
            const statusColor = STATUS_COLORS[op.status] ?? 'var(--muted)';

            return (
              <div key={op._id ?? i} style={{
                background: 'var(--bg2)',
                border: `1px solid ${isUrgent ? 'rgba(255,45,120,0.15)' : 'var(--border2)'}`,
                borderRadius: 3, padding: '8px 10px',
                display: 'flex', alignItems: 'center', gap: 8,
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = isUrgent ? 'rgba(255,45,120,0.15)' : 'var(--border2)')}
              >
                {/* Top accent on urgent */}
                {isUrgent && <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg,transparent,var(--magenta),transparent)',
                  opacity: 0.6,
                }} />}

                {/* Rank */}
                <div style={{ fontSize: 9, color: 'var(--muted)', width: 18, fontFamily: 'var(--font-hd)', flexShrink: 0 }}>
                  #{i + 1}
                </div>

                {/* Score */}
                <div style={{
                  width: 32, height: 32, borderRadius: 3, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-hd)', fontSize: 10, fontWeight: 900,
                  color: scoreColor, background: `${scoreColor}10`,
                  border: `1px solid ${scoreColor}25`,
                  textShadow: `0 0 8px ${scoreColor}80`,
                }}>{op.currentScore}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {op.title}
                    </span>
                    <a href={op.url} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', fontSize: 10, flexShrink: 0, textDecoration: 'none' }}>↗</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{
                      fontSize: 8, padding: '1px 5px', borderRadius: 2,
                      border: `1px solid ${statusColor}25`,
                      background: `${statusColor}08`, color: statusColor,
                      letterSpacing: '0.06em',
                    }}>{op.status.toUpperCase()}</span>
                    <span style={{ fontSize: 8, color: 'var(--muted)' }}>
                      {CATEGORY_META[op.category]?.icon} {op.organizer ?? op.source}
                    </span>
                    {daysLeft !== null && (
                      <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: deadlineColor, textShadow: isUrgent ? `0 0 6px ${deadlineColor}` : 'none' }}>
                        {isUrgent ? '🔥 ' : ''}{daysLeft}d LEFT
                      </span>
                    )}
                  </div>
                </div>

                {/* Score bars mini */}
                <div style={{ width: 80, flexShrink: 0 }}>
                  {['resumeValue','learningValue','placementValue'].map((k, idx) => {
                    const val = op.baseScores?.[k as keyof typeof op.baseScores] ?? 5;
                    const colors = ['var(--purple)','var(--cyan)','var(--green)'];
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                        <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 1, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${val * 10}%`, background: colors[idx], borderRadius: 1 }} />
                        </div>
                        <span style={{ fontSize: 7, color: 'var(--muted)', width: 8 }}>{val}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {op.status === 'new' && (
                    <button onClick={e => { e.stopPropagation(); quickAction(op._id!, 'shortlisted'); }} style={{
                      fontSize: 8, padding: '3px 7px', borderRadius: 2,
                      border: '1px solid rgba(255,230,0,0.35)', color: 'var(--yellow)',
                      background: 'transparent', cursor: 'pointer',
                      fontFamily: 'var(--font-hd)', fontWeight: 700, letterSpacing: '0.05em',
                    }}>★ SAVE</button>
                  )}
                  {['new','shortlisted'].includes(op.status) && (
                    <button onClick={e => { e.stopPropagation(); quickAction(op._id!, 'registered'); }} style={{
                      fontSize: 8, padding: '3px 7px', borderRadius: 2,
                      border: '1px solid rgba(0,255,159,0.35)', color: 'var(--green)',
                      background: 'transparent', cursor: 'pointer',
                      fontFamily: 'var(--font-hd)', fontWeight: 700, letterSpacing: '0.05em',
                    }}>✓ REG</button>
                  )}
                  {!['completed','skipped','expired'].includes(op.status) && (
                    <button onClick={e => { e.stopPropagation(); quickAction(op._id!, 'skipped'); }} style={{
                      fontSize: 8, padding: '3px 7px', borderRadius: 2,
                      border: '1px solid var(--border2)', color: 'var(--muted)',
                      background: 'transparent', cursor: 'pointer',
                      fontFamily: 'var(--font-hd)', fontWeight: 700, letterSpacing: '0.05em',
                    }}>SKIP</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}