import type { Opportunity } from '@opportunityos/shared';
import { CATEGORY_META } from '@opportunityos/shared';

interface Props {
  opportunities: Opportunity[];
  onAction: (id: string, status: string) => void;
  loading: boolean;
}

export default function OpportunityRadar({ opportunities, onAction, loading }: Props) {
  return (
    <div className="cp-panel">
      <div className="cp-title">
        // Opportunity radar
        <span className="cp-badge">RANKED BY ROI · LIVE</span>
      </div>

      {loading ? (
        <div style={{ fontSize: 9, color: 'var(--muted)' }}>SCANNING...</div>
      ) : opportunities.length === 0 ? (
        <div style={{ fontSize: 9, color: 'var(--muted)' }}>No opportunities found.</div>
      ) : (
        opportunities.map((op, i) => {
          const reg = op.dates?.registrationDeadline ?? op.dates?.submissionDeadline;
          const daysLeft = reg ? Math.ceil((new Date(reg).getTime() - Date.now()) / 86400000) : null;
          const isUrgent = daysLeft !== null && daysLeft <= 3;
          const isHot    = daysLeft !== null && daysLeft <= 7;

          const scoreColor = op.currentScore >= 90 ? 'var(--green)'
            : op.currentScore >= 70 ? 'var(--cyan)'
            : op.currentScore >= 50 ? 'var(--yellow)'
            : 'var(--magenta)';

          const deadlineColor = isUrgent ? 'var(--magenta)' : isHot ? 'var(--yellow)' : 'var(--muted)';

          return (
            <div key={op._id ?? i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              {/* Rank */}
              <div style={{ fontSize: 8, color: 'var(--muted)', width: 14, fontFamily: 'var(--font-hd)' }}>
                #{i + 1}
              </div>

              {/* Score badge */}
              <div style={{
                width: 28, height: 28, borderRadius: 3, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-hd)', fontSize: 9, fontWeight: 900,
                color: scoreColor,
                background: `${scoreColor}10`,
                border: `1px solid ${scoreColor}25`,
                textShadow: `0 0 8px ${scoreColor}80`,
              }}>
                {op.currentScore}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {op.title}
                </div>
                <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>
                  {CATEGORY_META[op.category]?.icon} {op.source} · {op.organizer ?? op.category}
                </div>
              </div>

              {/* Deadline */}
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: deadlineColor, flexShrink: 0 }}>
                {daysLeft === null ? '—' : isUrgent ? `🔥${daysLeft}d` : `${daysLeft}d`}
              </div>

              {/* Action */}
              {['new', 'shortlisted'].includes(op.status) ? (
                <button onClick={() => onAction(op._id!, 'registered')} style={{
                  fontSize: 8, padding: '3px 7px', borderRadius: 2,
                  border: '1px solid rgba(0,255,159,0.35)',
                  color: 'var(--green)', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'var(--font-hd)',
                  fontWeight: 700, letterSpacing: '0.05em',
                  transition: 'all 0.2s', flexShrink: 0,
                }}>REG</button>
              ) : (
                <button onClick={() => onAction(op._id!, 'shortlisted')} style={{
                  fontSize: 8, padding: '3px 7px', borderRadius: 2,
                  border: '1px solid rgba(255,230,0,0.35)',
                  color: 'var(--yellow)', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'var(--font-hd)',
                  fontWeight: 700, letterSpacing: '0.05em',
                  transition: 'all 0.2s', flexShrink: 0,
                }}>SAVE</button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}