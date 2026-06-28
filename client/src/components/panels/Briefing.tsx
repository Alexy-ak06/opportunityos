import type { Opportunity } from '@opportunityos/shared';

interface Props {
  opportunities: Opportunity[];
  urgentCount: number;
}

export default function Briefing({ opportunities, urgentCount }: Props) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  const topOp = opportunities[0];

  return (
    <div style={{
      background: 'linear-gradient(135deg,#03030a 0%,#060618 50%,#03030a 100%)',
      border: '1px solid rgba(0,245,255,0.18)',
      borderRadius: 4, padding: 14,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent)',
        animation: 'shimmer 3s infinite',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 180, height: 180,
        background: 'radial-gradient(circle,rgba(180,77,255,0.04) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 8, color: 'var(--muted)', marginBottom: 5, letterSpacing: '0.1em' }}>
        // AI MORNING BRIEFING · {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()} · KIIT BHUBANESWAR
      </div>

      <div style={{ fontFamily: 'var(--font-hd)', fontSize: 15, fontWeight: 900, marginBottom: 8 }}>
        {greeting},{' '}
        <span style={{ color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,245,255,0.8),0 0 40px rgba(0,245,255,0.4)' }}>
          AYUSH
        </span>{' '}⚡
      </div>

      <div style={{ fontSize: 10, color: '#7a8aaa', lineHeight: 1.8, marginBottom: 10 }}>
        I found{' '}
        <strong style={{ color: 'var(--text)' }}>{opportunities.length} active opportunities</strong>{' '}
        in your pipeline.{' '}
        {topOp && <>
          Best match: <strong style={{ color: 'var(--text)' }}>{topOp.title}</strong> — score{' '}
          <strong style={{ color: 'var(--cyan)' }}>{topOp.currentScore}/100</strong>.{' '}
        </>}
        {urgentCount > 0 && <>
          <strong style={{ color: 'var(--magenta)' }}>{urgentCount} registration{urgentCount > 1 ? 's' : ''}</strong>{' '}
          close within <strong style={{ color: 'var(--magenta)' }}>3 days</strong> — act now.{' '}
        </>}
        Weekly cert pick: <strong style={{ color: 'var(--text)' }}>Microsoft Azure AI-102</strong> — highest demand ↑.
        Estimated grind today: <strong style={{ color: 'var(--text)' }}>4h 20m</strong>.
        Streak: <strong style={{ color: 'var(--yellow)', textShadow: '0 0 8px rgba(255,230,0,0.4)' }}>7 DAYS 🔥</strong>
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        <div className="cp-chip cyan">✓ {opportunities.length} ACTIVE</div>
        {urgentCount > 0 && <div className="cp-chip magenta">⚠ {urgentCount} CLOSING SOON</div>}
        <div className="cp-chip green">⏱ 4H 20M TODAY</div>
        <div className="cp-chip purple">94% PROFILE FIT</div>
        <div className="cp-chip yellow">🔥 7-DAY STREAK</div>
      </div>
    </div>
  );
}