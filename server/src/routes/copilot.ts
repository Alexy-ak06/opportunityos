import { Router } from 'express';
import { OpportunityModel } from '../models/Opportunity';

export const copilotRouter = Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are Jarvis — the AI copilot inside OpportunityOS, a personal career intelligence system built by Ayush, a Year 1 CSE student at KIIT Bhubaneswar.

Ayush's profile:
- Targeting Software Engineer roles at top tech companies by 2029
- Focus areas: AI, Azure, Cloud, LLM Agents
- Prefers hackathons and certifications over generic coursework
- Avoids Web3
- Team size preference: 1-4
- Based in Bhubaneswar, Odisha

Your job: answer questions about his opportunities, deadlines, certifications, and career strategy. Be sharp, tactical, and specific. Use real opportunity names and data when given context. Keep responses under 4 sentences unless asked for detail. Never use markdown headers. Bold key terms with **text** sparingly.`;

copilotRouter.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ success: false, error: 'Groq API key not configured' });
  }

  try {
    const topOpportunities = await OpportunityModel.find({
      status: { $in: ['new', 'shortlisted', 'registered'] },
    })
      .sort({ currentScore: -1 })
      .limit(8)
      .select('title category currentScore dates organizer source')
      .lean();

    const contextLines = topOpportunities.map(op => {
      const deadline = op.dates?.registrationDeadline ?? op.dates?.submissionDeadline;
      const daysLeft = deadline
        ? Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
        : null;
      return `- ${op.title} (${op.category}, ${op.organizer ?? op.source}, ROI ${op.currentScore}${daysLeft !== null ? `, ${daysLeft}d left` : ''})`;
    }).join('\n');

    const contextBlock = contextLines
      ? `\n\nCurrent live opportunities in his dashboard:\n${contextLines}`
      : '';

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        temperature: 0.6,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + contextBlock },
          { role: 'user', content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ success: false, error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'Unable to generate a response.';

    return res.json({ success: true, data: { reply } });
  } catch (err) {
    console.error('Copilot error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});