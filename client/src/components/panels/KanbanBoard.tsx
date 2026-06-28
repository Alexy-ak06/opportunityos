import type { Opportunity } from '@opportunityos/shared';
import { CATEGORY_META } from '@opportunityos/shared';

interface Props {
  opportunities: Opportunity[];
  onAction: (id: string, status: string) => void;
}

const COLS = [
  { key: 'critical',  label: '⚡ Critical',   color: 'var(--magenta)', statuses: ['new'],                    scoreMin: 85 },
  { key: 'high',      label: '◈ High Value',  color: 'var(--yellow)',  statuses: ['shortlisted'],             scoreMin: 0  },
  { key: 'backlog',   label: '▤ Backlog',     color: 'var(--muted)',   statuses: ['registered','in_progress'],scoreMin: 0  },
];

function getBadge(op: Opportunity) {
  const reg = op.dates?.registrationDeadline;
  const days = reg ? Math.ceil((new Date(reg).getTime() - Date.now()) / 86400000) : null;
  if (days !== null && days <= 3) return { label: `🔥 ${days}D LEFT`, color: 'var(--magenta)', bc: 'rgba(255,45,120,0.3)', bg: 'rgba(255,45,120,0.08)' };
  if (days !== null && days <= 7) return { label: `⚠ ${days}D`,      color: 'var(--yellow)',  bc: 'rgba(255,230,0,0.3)',  bg: 'rgba(255,230,0,0.08)'  };
  if (op.currentScore >= 90)       return { label: `ROI ${op.currentScore}`, color: 'var(--cyan)',    bc: 'rgba(0,245,255,0.3)',  bg: 'rgba(0,245,255,0.08)'  };
  return { label: `ROI ${op.currentScore}`, color: 'var(--muted)', bc: 'var(--border2)', bg: 'rgba(255,255,255,0.02)' };
}

export default function KanbanBoard({ opportunities, onAction }: Props) {
  const critical = opportunities.filter(o => o.currentScore >= 85 && o.status === 'new').slice(0, 3);
  const high     = opportunities.filter(o => o.currentScore >= 60 && o.currentScore < 85).slice(0, 3);
  const backlog  = opportunities.filter(o => o.currentScore < 60).slice(0, 3);
  const cols     = [critical, high, backlog];

  return (
    <div className="cp-panel accent-yellow">
      <div className="cp-title yellow">
        // AI priority board
        <span className="cp-badge">DRAG TO RECLASSIFY · LIVE SYNC</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
        {COLS.map(({ key, label, color }, ci) => (
          <div key={key} style={{
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border2)',
            borderRadius: 3, padding: 7,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg,transparent,${color},transparent)`,
            }} />

            {/* Column header */}
            <div style={{
              fontFamily: 'var(--font-hd)', fontSize: 8, fontWeight: 700,
              color, textShadow: `0 0 8px ${color}60`,
              marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4,
              letterSpacing: '0.08em',
            }}>
              {label}
              <span style={{
                background: `${color}12`, color,
                border: `1px solid ${color}25`,
                borderRadius: 2, padding: '1px 4px', fontSize: 7,
              }}>{cols[ci].length}</span>
            </div>

            {/* Cards */}
            {cols[ci].length === 0 ? (
              <div style={{ fontSize: 8, color: 'var(--muted)', padding: '8px 0', textAlign: 'center' }}>—</div>
            ) : cols[ci].map(op => {
              const badge = getBadge(op);
              return (
                <div key={op._id} className="kc-card" onClick={() => onAction(op._id!, 'shortlisted')}>
                  <div style={{ fontSize: 9, color: 'var(--text)', fontWeight: 600, marginBottom: 2 }}>
                    {op.title.length > 28 ? op.title.slice(0, 28) + '…' : op.title}
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--muted)' }}>
                    {CATEGORY_META[op.category]?.icon} {op.organizer ?? op.source}
                  </div>
                  <div style={{
                    display: 'inline-block', fontSize: 7, padding: '1px 5px',
                    borderRadius: 2, marginTop: 4, border: `1px solid ${badge.bc}`,
                    background: badge.bg, color: badge.color, letterSpacing: '0.05em',
                  }}>{badge.label}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}