import type { Opportunity } from '@opportunityos/shared';

interface Props {
  opportunities: Opportunity[];
  loading: boolean;
}

const STATS = [
  { key: 'total',   label: 'Found today',   color: 'cyan'    },
  { key: 'urgent',  label: 'Deadlines',     color: 'magenta' },
  { key: 'high',    label: 'High ROI',      color: 'green'   },
  { key: 'active',  label: 'Active apps',   color: 'purple'  },
  { key: 'agents',  label: 'Agents live',   color: 'yellow'  },
];

export default function StatsBar({ opportunities, loading }: Props) {
  const total  = opportunities.length;
  const urgent = opportunities.filter(o => {
    const d = o.dates?.registrationDeadline ?? o.dates?.submissionDeadline;
    if (!d) return false;
    return (new Date(d).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const high   = opportunities.filter(o => o.currentScore >= 80).length;
  const active = opportunities.filter(o => ['registered','in_progress'].includes(o.status)).length;
  const agents = 12;

  const values: Record<string, number> = { total, urgent, high, active, agents };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
      {STATS.map(({ key, label, color }) => (
        <div key={key} className={`cp-stat ${color}`}>
          <div className="stat-val">
            {loading ? '—' : values[key]}
          </div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}