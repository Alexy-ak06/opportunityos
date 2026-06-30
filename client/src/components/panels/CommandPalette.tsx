import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { opportunitiesApi } from '../../lib/api';
import type { Opportunity } from '@opportunityos/shared';

interface Command {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  action: () => void;
  category: 'PAGE' | 'OPPORTUNITY' | 'ACTION';
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      opportunitiesApi.list({ sort: 'roi', limit: 30 }).then(r => setOpportunities(r.data.data)).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const pageCommands: Command[] = [
    { id: 'p1', label: 'Command Center', sublabel: 'Go to dashboard', icon: '⌘', action: () => navigate('/'), category: 'PAGE' },
    { id: 'p2', label: 'Opportunities', sublabel: 'View opportunity radar', icon: '◈', action: () => navigate('/opportunities'), category: 'PAGE' },
    { id: 'p3', label: 'Career GPS', sublabel: 'View roadmap', icon: '◎', action: () => navigate('/goals'), category: 'PAGE' },
    { id: 'p4', label: 'Analytics', sublabel: 'View career data', icon: '▦', action: () => navigate('/analytics'), category: 'PAGE' },
    { id: 'p5', label: 'Community', sublabel: 'Submit & browse hidden opportunities', icon: '👥', action: () => navigate('/community'), category: 'PAGE' },
    { id: 'p6', label: 'Automation', sublabel: 'Configure automations', icon: '⚙', action: () => navigate('/automation'), category: 'PAGE' },
  ];

  const actionCommands: Command[] = [
    { id: 'a1', label: 'Show deadlines this week', icon: '⏰', action: () => navigate('/opportunities'), category: 'ACTION' },
    { id: 'a2', label: 'Show high ROI opportunities', icon: '⚡', action: () => navigate('/opportunities'), category: 'ACTION' },
    { id: 'a3', label: 'What should I do today', icon: '🎯', action: () => navigate('/'), category: 'ACTION' },
  ];

  const opportunityCommands: Command[] = opportunities
    .filter(op => query.length > 0 && op.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6)
    .map(op => ({
      id: op._id!,
      label: op.title,
      sublabel: `${op.category} · ${op.organizer ?? op.source} · ROI ${op.currentScore}`,
      icon: '◈',
      action: () => window.open(op.url, '_blank'),
      category: 'OPPORTUNITY' as const,
    }));

  const filteredPages = pageCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
  const filteredActions = actionCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const allResults = query.length === 0
    ? [...pageCommands, ...actionCommands]
    : [...opportunityCommands, ...filteredPages, ...filteredActions];

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = allResults[selectedIndex];
      if (cmd) { cmd.action(); setOpen(false); }
    }
  };

  if (!open) return null;

  const categoryColor = (cat: string) =>
    cat === 'PAGE' ? 'var(--cyan)' : cat === 'OPPORTUNITY' ? 'var(--green)' : 'var(--purple)';

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fade-in 0.15s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 560, maxWidth: '90vw',
          background: 'var(--bg2)',
          border: '1px solid rgba(0,245,255,0.25)',
          borderRadius: 6,
          boxShadow: '0 0 60px rgba(0,245,255,0.15), 0 20px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid rgba(0,245,255,0.1)' }}>
          <span style={{ color: 'var(--cyan)', fontSize: 16, textShadow: '0 0 8px rgba(0,245,255,0.5)' }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search opportunities..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-mono)',
            }}
          />
          <span style={{
            fontSize: 8, padding: '2px 6px', borderRadius: 2,
            border: '1px solid var(--border2)', color: 'var(--muted)',
            fontFamily: 'var(--font-mono)',
          }}>ESC</span>
        </div>

        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 6 }}>
          {allResults.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-hd)', letterSpacing: '0.08em' }}>
              NO RESULTS FOUND
            </div>
          )}
          {allResults.map((cmd, i) => {
            const color = categoryColor(cmd.category);
            const isSelected = i === selectedIndex;
            return (
              <div
                key={cmd.id}
                onClick={() => { cmd.action(); setOpen(false); }}
                onMouseEnter={() => setSelectedIndex(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 3, cursor: 'pointer',
                  background: isSelected ? `${color}10` : 'transparent',
                  border: `1px solid ${isSelected ? color + '30' : 'transparent'}`,
                  transition: 'all 0.1s',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 3, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color, background: `${color}10`,
                  border: `1px solid ${color}25`,
                }}>{cmd.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: isSelected ? 'var(--text)' : '#9ab', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cmd.label}
                  </div>
                  {cmd.sublabel && (
                    <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cmd.sublabel}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: 7, padding: '1px 5px', borderRadius: 2, flexShrink: 0,
                  border: `1px solid ${color}20`, color, letterSpacing: '0.06em',
                }}>{cmd.category}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '8px 14px',
          borderTop: '1px solid rgba(0,245,255,0.08)', fontSize: 8, color: 'var(--muted)',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <div style={{ flex: 1 }} />
          <span style={{ color: 'var(--cyan)', textShadow: '0 0 6px rgba(0,245,255,0.4)' }}>OPPORTUNITYOS</span>
        </div>
      </div>
    </div>
  );
}