import type { Opportunity } from '@opportunityos/shared';
import { formatDistanceToNow } from 'date-fns';

interface Props { opportunities: Opportunity[] }

const FIELDS = [
  { key: 'year',      label: 'Year',       icon: '🎓' },
  { key: 'team',      label: 'Team',       icon: '👥' },
  { key: 'reg',       label: 'Reg. closes', icon: '📅' },
  { key: 'prize',     label: 'Prize',      icon: '💰' },
  { key: 'cert',      label: 'Certificate', icon: '🏅' },
  { key: 'swag',      label: 'Swag',       icon: '👕' },
  { key: 'travel',    label: 'Travel',     icon: '✈️' },
  { key: 'interview', label: 'Interview',  icon: '💼' },
  { key: 'mode',      label: 'Mode',       icon: '🌐' },
  { key: 'submit',    label: 'Submit',     icon: '📤' },
];

function getFieldValue(op: Opportunity, key: string): { val: string; color: string } {
  const c = { good: 'var(--green)', warn: 'var(--yellow)', bad: 'var(--magenta)', neutral: 'var(--text)' };
  const reg  = op.dates?.registrationDeadline;
  const sub  = op.dates?.submissionDeadline;

  switch (key) {
    case 'year':      return { val: 'All years',  color: c.good };
    case 'team':      return { val: op.teamSize ?? '1–4', color: c.neutral };
    case 'reg': {
      if (!reg) return { val: 'Open', color: c.good };
      const days = Math.ceil((new Date(reg).getTime() - Date.now()) / 86400000);
      return days <= 3
        ? { val: `🔥 ${days}d`, color: c.bad }
        : { val: `${days} days`,  color: days <= 7 ? c.warn : c.neutral };
    }
    case 'prize':     return { val: op.prizePool ?? '—', color: op.prizePool ? c.good : c.neutral };
    case 'cert':      return { val: 'YES',     color: c.good };
    case 'swag':      return { val: op.category === 'hackathon' ? 'YES' : 'NO', color: op.category === 'hackathon' ? c.good : c.bad };
    case 'travel':    return { val: op.isOnline ? 'NO' : 'YES', color: op.isOnline ? c.bad : c.good };
    case 'interview': return { val: op.category === 'hiring-challenge' ? 'Winners' : 'Top 10', color: c.warn };
    case 'mode':      return { val: op.isOnline ? 'ONLINE' : 'OFFLINE', color: op.isOnline ? 'var(--cyan)' : c.warn };
    case 'submit': {
      if (!sub) return { val: '—', color: c.neutral };
      const days = Math.ceil((new Date(sub).getTime() - Date.now()) / 86400000);
      return { val: `${days} days`, color: c.neutral };
    }
    default: return { val: '—', color: c.neutral };
  }
}

function EligCard({ op }: { op: Opportunity }) {
  const reg = op.dates?.registrationDeadline;
  const daysLeft = reg ? Math.ceil((new Date(reg).getTime() - Date.now()) / 86400000) : null;
  const isCritical = daysLeft !== null && daysLeft <= 3;

  return (
    <div style={{
      background: 'var(--bg3)',
      border: `1px solid ${isCritical ? 'rgba(255,45,120,0.2)' : 'rgba(0,245,255,0.08)'}`,
      borderRadius: 3, padding: 9, marginBottom: 7,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${isCritical ? 'var(--magenta)' : 'var(--cyan)'},transparent)`,
        opacity: 0.4,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 10, color: 'var(--text)', fontWeight: 600 }}>{op.title}</div>
        <div style={{
          fontSize: 8, padding: '2px 6px', borderRadius: 2, fontWeight: 700,
          color: 'var(--green)', border: '1px solid rgba(0,255,159,0.3)',
          background: 'rgba(0,255,159,0.05)', letterSpacing: '0.08em',
        }}>✓ ELIGIBLE</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {FIELDS.map(({ key, label, icon }) => {
          const { val, color } = getFieldValue(op, key);
          return (
            <div key={key} className="elig-row">
              <span style={{ fontSize: 10 }}>{icon}</span>
              <span style={{ fontSize: 8, color: 'var(--muted)', flex: 1 }}>{label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color }}>{val}</span>
            </div>
          );
        })}
      </div>

      <a href={op.url} target="_blank" rel="noreferrer"
        className={`apply-btn ${isCritical ? 'magenta' : 'cyan'}`}>
        APPLY NOW {isCritical ? '🔥' : '→'}
      </a>
    </div>
  );
}

export default function EligibilityEngine({ opportunities }: Props) {
  const top2 = opportunities.slice(0, 2);

  return (
    <div className="cp-panel">
      <div className="cp-title">
        // Eligibility engine
        <span className="cp-badge">ONE-GLANCE CHECK</span>
      </div>
      {top2.length === 0
        ? <div style={{ fontSize: 9, color: 'var(--muted)' }}>Loading...</div>
        : top2.map(op => <EligCard key={op._id} op={op} />)
      }
    </div>
  );
}