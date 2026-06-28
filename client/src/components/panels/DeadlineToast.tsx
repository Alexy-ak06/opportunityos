import { useEffect, useState } from 'react';
import { getSocket } from '../../lib/socket';
import type { DeadlineAlert } from '@opportunityos/shared';

interface Toast {
  id: string;
  alert: DeadlineAlert;
}

export default function DeadlineToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('deadline:alert', (alert: DeadlineAlert) => {
      const id = `${alert.opportunityId}-${alert.threshold}`;
      setToasts(prev => [...prev, { id, alert }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 8000);
    });
    return () => { socket.off('deadline:alert'); };
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const urgencyColor = (threshold: number) => {
    if (threshold <= 1) return 'var(--magenta)';
    if (threshold <= 3) return 'var(--yellow)';
    return 'var(--cyan)';
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
      maxWidth: 320,
    }}>
      {toasts.map(({ id, alert }) => {
        const color = urgencyColor(alert.threshold);
        return (
          <div key={id} style={{
            background: 'var(--bg2)',
            border: `1px solid ${color}40`,
            borderRadius: 4, padding: 12,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            boxShadow: `0 0 30px ${color}20, 0 8px 32px rgba(0,0,0,0.5)`,
            animation: 'slide-up 0.3s ease-out',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg,transparent,${color},transparent)`,
            }} />

            {/* Icon */}
            <div style={{
              width: 28, height: 28, borderRadius: 3, flexShrink: 0,
              background: `${color}12`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
              boxShadow: `0 0 10px ${color}30`,
            }}>🔔</div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-hd)', fontSize: 9, fontWeight: 700,
                color, textShadow: `0 0 8px ${color}60`,
                letterSpacing: '0.08em', marginBottom: 3,
              }}>DEADLINE ALERT</div>
              <div style={{ fontSize: 10, color: 'var(--text)', fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {alert.opportunityTitle}
              </div>
              <div style={{ fontSize: 9, color, textShadow: `0 0 6px ${color}60` }}>
                {alert.deadlineType} closes in {alert.threshold} day{alert.threshold > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                {alert.hoursRemaining}h remaining
              </div>
            </div>

            {/* Dismiss */}
            <button onClick={() => dismiss(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: 14, flexShrink: 0,
              padding: 2, lineHeight: 1,
              transition: 'color 0.2s',
            }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}