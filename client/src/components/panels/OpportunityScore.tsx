import type { Opportunity } from '@opportunityos/shared';

interface Props { opportunities: Opportunity[] }

const FACTORS = [
  { key: 'resume',   label: 'Resume value',  scoreKey: 'resumeValue',    grad: 'linear-gradient(90deg,var(--purple),var(--cyan))' },
  { key: 'learning', label: 'Learning value', scoreKey: 'learningValue',  grad: 'linear-gradient(90deg,var(--cyan),var(--green))' },
  { key: 'placement',label: 'Career impact',  scoreKey: 'placementValue', grad: 'linear-gradient(90deg,var(--green),#00e5ff)' },
  { key: 'reach',    label: 'Reach value',    scoreKey: 'reachValue',     grad: 'linear-gradient(90deg,var(--cyan),var(--purple))' },
  { key: 'time',     label: 'Time invest',    scoreKey: 'timeRequired',   grad: 'linear-gradient(90deg,var(--magenta),#ff6090)' },
];

function ScoreCard({ op, rank }: { op: Opportunity; rank: number }) {
  const scores = op.baseScores;
  const isTop  = rank === 0;
  const scoreColor = op.currentScore >= 90 ? 'var(--green)'
    : op.currentScore >= 70 ? 'var(--cyan)'
    : op.currentScore >= 50 ? 'var(--yellow)'
    : 'var(--magenta)';

  return (
    <div style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border2)',
      borderRadius: 3, padding: 9,
      marginBottom: 6, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${scoreColor},transparent)`,
        opacity: 0.5,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text)', fontWeight: 600 }}>{op.title}</div>
          <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>
            {op.category} · {op.organizer ?? op.source}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--font-hd)', fontSize: 24, fontWeight: 900,
            color: scoreColor,
            textShadow: `0 0 20px ${scoreColor}99`,
            lineHeight: 1,
          }}>{op.currentScore}</div>
          <div style={{ fontSize: 7, color: 'var(--muted)' }}>/100</div>
        </div>
      </div>

      {/* Factor bars */}
      {FACTORS.map(({ key, label, scoreKey, grad }) => {
        const raw  = scores?.[scoreKey as keyof typeof scores] ?? 5;
        const pct  = (raw / 10) * 100;
        const display = scoreKey === 'timeRequired' ? `${raw}/10` : raw;
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ fontSize: 8, color: '#555580', width: 80, flexShrink: 0 }}>{label}</div>
            <div className="neon-bar-track">
              <div className="neon-bar-fill" style={{ width: `${pct}%`, background: grad }} />
            </div>
            <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--muted)', width: 18, textAlign: 'right' }}>
              {display}
            </div>
          </div>
        );
      })}

      {/* Goal fit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <div style={{ fontSize: 8, color: '#555580', width: 80, flexShrink: 0 }}>Goal fit</div>
        <div className="neon-bar-track">
          <div className="neon-bar-fill" style={{ width: '94%', background: 'linear-gradient(90deg,var(--green),var(--cyan))' }} />
        </div>
        <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--green)', width: 18, textAlign: 'right' }}>94</div>
      </div>
    </div>
  );
}

export default function OpportunityScore({ opportunities }: Props) {
  const top2 = opportunities.slice(0, 2);

  return (
    <div className="cp-panel accent-magenta">
      <div className="cp-title magenta">
        // Opportunity score
        <span className="cp-badge">6-FACTOR AI RATING</span>
      </div>
      {top2.length === 0
        ? <div style={{ fontSize: 9, color: 'var(--muted)' }}>Loading...</div>
        : top2.map((op, i) => <ScoreCard key={op._id} op={op} rank={i} />)
      }
    </div>
  );
}