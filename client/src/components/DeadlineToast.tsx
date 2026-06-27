import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { getSocket } from '../lib/socket';
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
    if (threshold <= 1) return '#ef4444';
    if (threshold <= 3) return '#f97316';
    return '#f59e0b';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(({ id, alert }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex items-start gap-3 p-4 rounded-xl shadow-2xl border"
            style={{ background: '#0f0f1a', borderColor: urgencyColor(alert.threshold) + '44' }}
          >
            <Bell size={16} style={{ color: urgencyColor(alert.threshold) }} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{alert.opportunityTitle}</div>
              <div className="text-xs mt-0.5" style={{ color: urgencyColor(alert.threshold) }}>
                {alert.deadlineType} deadline in {alert.threshold} day{alert.threshold > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500 font-mono mt-0.5">{alert.hoursRemaining}h remaining</div>
            </div>
            <button onClick={() => dismiss(id)} className="text-gray-600 hover:text-gray-400 shrink-0">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
