import { useState } from 'react';

const DEMO_CONVOS = [
  {
    user: 'What should I finish before Friday?',
    ai: 'Register Flipkart Grid today — closes in 3 days. Then IBM Module 5 (2h). Push TrustChain to GitHub by Thursday. Total: ~4h.',
  },
  {
    user: 'Show AI summits I must attend this month',
    ai: 'Inc42 AI Summit (Delhi, Jul 2 — networking goldmine). KIIT AI Workshop (campus, Jul 1 — free). India AI Impact Summit (Bharat Mandapam — bookmark now).',
  },
];

export default function AICopilot() {
  const [input, setInput] = useState('');
  const [convos, setConvos] = useState(DEMO_CONVOS);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are Jarvis — the AI copilot of OpportunityOS, a personal career intelligence system for Ayush, a Year 1 CSE student at KIIT Bhubaneswar targeting Software Engineer roles at top tech companies by 2029. He focuses on AI, Azure, Cloud, hackathons and certifications. Keep answers sharp, tactical, and under 3 sentences. Use specific names of opportunities, platforms, or certs when possible.`,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });
      const data = await res.json();
      const aiText = data.content?.[0]?.text ?? 'Unable to get response.';
      setConvos(prev => [...prev, { user: userMsg, ai: aiText }]);
    } catch {
      setConvos(prev => [...prev, { user: userMsg, ai: 'Connection error. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-panel accent-purple">
      <div className="cp-title purple">
        // AI copilot
        <span className="cp-badge">POWERED BY CLAUDE · REAL-TIME</span>
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
          style={{ flex: 1 }}
        />
        <button onClick={handleSend} style={{
          background: 'rgba(0,245,255,0.1)',
          border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: 2, padding: '5px 10px',
          color: 'var(--cyan)', cursor: 'pointer',
          fontFamily: 'var(--font-hd)', fontSize: 8,
          fontWeight: 700, letterSpacing: '0.1em',
          textShadow: '0 0 8px rgba(0,245,255,0.5)',
          transition: 'all 0.2s',
        }}>
          SEND
        </button>
      </div>
    </div>
  );
}