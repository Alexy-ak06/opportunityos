import { useState } from 'react';

const DEMO_CONVOS = [
  {
    user: 'What should I finish before Friday?',
    ai: 'Register **Flipkart Grid** today — closes in 3 days. Then **IBM Module 5** (2h). Push TrustChain to GitHub by Thursday. Total: ~4h.',
  },
];

export default function AICopilot() {
  const [input, setInput] = useState('');
  const [convos, setConvos] = useState(DEMO_CONVOS);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      const aiText = data.success ? data.data.reply : 'Connection error. Try again.';
      setConvos(prev => [...prev, { user: userMsg, ai: aiText }]);
    } catch {
      setConvos(prev => [...prev, { user: userMsg, ai: 'Connection error. Check if the server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-panel accent-purple">
      <div className="cp-title purple">
        // AI copilot
        <span className="cp-badge">POWERED BY GROQ · LIVE</span>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 3, padding: 8, maxHeight: 280, overflowY: 'auto' }}>
        {convos.map((c, i) => (
          <div key={i}>
            <div className="cp-copilot-user">{c.user}</div>
            <div className="cp-copilot-ai" dangerouslySetInnerHTML={{
              __html: c.ai.replace(/\*\*(.*?)\*\*/g, `<strong style="color:var(--cyan)">$1</strong>`)
            }} />
          </div>
        ))}
        {loading && (
          <div className="cp-copilot-ai" style={{ color: 'var(--muted)', animation: 'neon-pulse 1s infinite' }}>
            JARVIS IS THINKING...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        <input
          className="cp-copilot-input"
          placeholder='ASK JARVIS... "find llm hackathons" · "which certs this week?"'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button onClick={handleSend} disabled={loading} style={{
          background: 'rgba(0,245,255,0.1)',
          border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: 2, padding: '5px 10px',
          color: 'var(--cyan)', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-hd)', fontSize: 8,
          fontWeight: 700, letterSpacing: '0.1em',
          textShadow: '0 0 8px rgba(0,245,255,0.5)',
          transition: 'all 0.2s',
          opacity: loading ? 0.5 : 1,
        }}>
          {loading ? '...' : 'SEND'}
        </button>
      </div>
    </div>
  );
}