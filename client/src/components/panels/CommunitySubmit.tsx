export default function CommunitySubmit() {
  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(0,245,255,0.03),rgba(180,77,255,0.03))',
      border: '1px solid rgba(0,245,255,0.15)',
      borderRadius: 4, padding: 12,
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,var(--cyan),var(--purple),transparent)',
      }} />

      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 3, flexShrink: 0,
        background: 'rgba(0,245,255,0.08)',
        border: '1px solid rgba(0,245,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
        boxShadow: '0 0 20px rgba(0,245,255,0.1)',
      }}>🔗</div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-hd)', fontSize: 10, fontWeight: 700,
          color: 'var(--cyan)',
          textShadow: '0 0 10px rgba(0,245,255,0.5)',
          marginBottom: 3, letterSpacing: '0.08em',
        }}>
          // SUBMIT A HIDDEN OPPORTUNITY
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)', lineHeight: 1.6 }}>
          Found a hackathon on <span style={{ color: '#7a8aaa' }}>WhatsApp</span>,{' '}
          <span style={{ color: '#7a8aaa' }}>LinkedIn</span>, or a college group that's not listed anywhere?
          Submit the link — Jarvis verifies and alerts everyone.{' '}
          <span style={{ color: 'var(--cyan)' }}>IIT/NIT fests, campus-only events, Discord-only challenges</span> — nothing gets missed.
        </div>
      </div>

      {/* Button */}
      <button style={{
        background: 'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(180,77,255,0.15))',
        color: 'var(--cyan)',
        border: '1px solid rgba(0,245,255,0.4)',
        borderRadius: 2, padding: '8px 14px',
        fontSize: 9, fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'var(--font-hd)',
        flexShrink: 0, letterSpacing: '0.1em',
        textShadow: '0 0 10px rgba(0,245,255,0.5)',
        boxShadow: '0 0 20px rgba(0,245,255,0.1)',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(0,245,255,0.3)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0,245,255,0.1)')}
      >
        + SUBMIT LINK
      </button>
    </div>
  );
}