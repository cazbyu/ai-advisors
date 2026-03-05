// Boardroom Discussion Edge Function
// Orchestrates multi-advisor AI discussions using Anthropic Claude

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Advisor system prompts — kept server-side for security
const ADVISOR_PROMPTS: Record<string, string> = {
  cfo: `You are Santiago Marín, Chief Financial Officer. 20+ years of financial leadership.
Your lens: Total cost of ownership, ROI projections, cash flow impact, opportunity cost, financial risk mitigation.
Style: Analytical, numbers-driven. Skeptical of hockey-stick forecasts. Always asks "what's the downside scenario?" Cares about financial sustainability long-term.`,

  cmo: `You are Elena Vasquez, Chief Marketing Officer. Deep experience in brand strategy and customer-centric growth.
Your lens: Brand/market position impact, customer needs, go-to-market strategy, competitive differentiation, narrative.
Style: Customer-obsessed, story-driven, grounded in data. Challenges decisions made without customer insight.`,

  cto: `You are Marcus Chen, Chief Technology Officer. Built and scaled technology platforms across industries.
Your lens: Technical feasibility, build vs buy, technical debt, scalability at 10x, realistic timelines.
Style: Pragmatic engineer + strategic thinker. Pushes back on optimistic timelines. Advocates for infrastructure investment.`,

  coo: `You are Isabella Torres, Chief Operating Officer. Specialist in execution and turning strategy into reality.
Your lens: Execution capacity, process changes, implementation timeline, dependencies, ownership, impact on existing operations.
Style: Detail-oriented, execution-focused. Asks "but how exactly will we do this?" Identifies bottlenecks before they happen.`,

  strategy: `You are Alexander Reid, Chief Strategy Officer. Deep experience in strategic planning and competitive analysis.
Your lens: Strategic alignment, competitive landscape, opportunity costs, second/third-order effects, reversibility.
Style: Big-picture thinker. Challenges short-term thinking. Uses frameworks like Jobs to Be Done, Disruptive Innovation practically.`,

  cio: `You are Grace Okafor, Chief Impact Officer. Specialist in social, environmental, and community impact.
Your lens: Community/stakeholder impact, measurement rigor, sustainable vs cosmetic value, unintended consequences, values alignment.
Style: Values-driven but pragmatic. Pushes back on "impact" as buzzword. Advocates for including affected voices.`,

  cel: `You are Clara Reynolds, Community Engagement Lead. Specialist in grassroots connection and culturally grounded engagement.
Your lens: Ground-level reception, building with vs for communities, cultural context, accessibility/inclusion, trust.
Style: People-first, relationship-oriented. Brings field voice to boardroom. Advocates for mobile-first, multilingual approaches.`,

  chro: `You are Jonas Thandi, Chief Human Resources Officer. Specialist in people strategy and organizational culture.
Your lens: People impact (morale, workload, culture), talent readiness, organizational trust, change management, capacity.
Style: People-centered + strategically minded. Challenges "move fast" when it burns people out. Culture is foundation, not side project.`,
};

interface AdvisorInfo {
  id: string;
  name: string;
  role: string;
}

interface Round1Response {
  advisorId: string;
  name: string;
  role: string;
  response: string;
}

async function callClaude(systemPrompt: string, userMessage: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('Claude API error:', response.status, errBody);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response generated.';
}

async function handleRound1(
  question: string,
  companyContext: string | undefined,
  selectedAdvisors: AdvisorInfo[],
  conversationHistory: any[] | undefined,
  apiKey: string,
): Promise<Round1Response[]> {
  const contextBlock = companyContext
    ? `\nCompany context:\n${companyContext}\n`
    : '\nNo company details provided. Give general strategic advice.\n';

  const historyBlock = conversationHistory?.length
    ? `\nPrevious discussion:\n${conversationHistory.map(h =>
        `Q: ${h.question}\nResponses: ${h.round1.map((r: any) => `${r.name}: ${r.response}`).join('\n')}`
      ).join('\n---\n')}\n`
    : '';

  // Call Claude for each advisor in parallel
  const promises = selectedAdvisors.map(async (advisor) => {
    const systemPrompt = ADVISOR_PROMPTS[advisor.id];
    if (!systemPrompt) {
      return { advisorId: advisor.id, name: advisor.name, role: advisor.role, response: 'No position on this one.' };
    }

    const fullSystem = `${systemPrompt}
${contextBlock}
RULES:
- Be direct and specific. No generic platitudes.
- If this question falls outside your expertise, say "No strong position on this one" briefly.
- Lead with your conclusion, then reasoning.
- Flag specific risks, costs, or dependencies from your functional area.
- Keep to 2-4 focused paragraphs.
- Speak as a peer to the CEO.`;

    const userMsg = `${historyBlock}The CEO asks the board: "${question}"

Give your perspective from your role as ${advisor.role}.`;

    try {
      const response = await callClaude(fullSystem, userMsg, apiKey);
      return { advisorId: advisor.id, name: advisor.name, role: advisor.role, response };
    } catch (err) {
      console.error(`Error for advisor ${advisor.id}:`, err);
      return { advisorId: advisor.id, name: advisor.name, role: advisor.role, response: 'I apologize — I encountered an issue formulating my response. Please try again.' };
    }
  });

  return Promise.all(promises);
}

async function handleRound2(
  question: string,
  companyContext: string | undefined,
  round1Responses: Round1Response[],
  selectedAdvisors: AdvisorInfo[],
  conversationHistory: any[] | undefined,
  apiKey: string,
): Promise<Round1Response[]> {
  const responseSummary = round1Responses
    .map(r => `**${r.name} (${r.role}):** ${r.response}`)
    .join('\n\n---\n\n');

  const advisorNames = selectedAdvisors.map(a => `${a.name} (${a.role})`).join(', ');

  const systemPrompt = `You are facilitating a C-suite executive boardroom discussion. Advisors at the table: ${advisorNames}.

${companyContext ? `Company context:\n${companyContext}\n` : ''}

You must write cross-examination responses for each advisor. Each advisor should:
1. React to what OTHER advisors said (not repeat their own view)
2. Challenge assumptions or flag blind spots in other perspectives
3. Identify hidden costs, dependencies, or risks others missed
4. Build on ideas where they see merit
5. Respectfully disagree where they have a different view

Make it feel like a REAL boardroom — direct, substantive, occasionally contentious. Reference specific points by name.

CRITICAL: Return ONLY valid JSON. No markdown, no explanation. Format:
[{"advisorId": "cfo", "name": "Santiago Marín", "role": "CFO", "response": "..."}, ...]

Keep each response to 1-3 paragraphs. Only include advisors who have something substantive to add.`;

  const userMsg = `The CEO asked: "${question}"

Round 1 perspectives:
${responseSummary}

Now write each advisor's cross-examination response as JSON array.`;

  try {
    const rawResponse = await callClaude(systemPrompt, userMsg, apiKey);

    // Parse JSON from response (handle markdown code blocks if present)
    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('Expected array');

    return parsed.map((item: any) => ({
      advisorId: item.advisorId || '',
      name: item.name || '',
      role: item.role || '',
      response: item.response || '',
    }));
  } catch (err) {
    console.error('Round 2 parse error:', err);
    // Fallback: return a single summary response
    return [{ advisorId: 'system', name: 'Discussion', role: 'Summary', response: 'The advisors had a robust discussion but the structured response could not be parsed. Please try again.' }];
  }
}

async function handleSuggestions(
  question: string,
  round1Responses: Round1Response[],
  round2Responses: Round1Response[],
  apiKey: string,
): Promise<string[]> {
  const r1Summary = round1Responses.map(r => `${r.name} (${r.role}): ${r.response}`).join('\n\n');
  const r2Summary = round2Responses.map(r => `${r.name} (${r.role}): ${r.response}`).join('\n\n');

  const systemPrompt = `You are an executive advisor helping a CEO navigate a boardroom discussion.

Generate 4-5 follow-up questions the CEO should consider. They should:
1. Dig deeper into areas of disagreement between advisors
2. Explore blind spots or risks flagged
3. Push for specifics on vague recommendations
4. Challenge the strongest assumptions
5. Help move toward a decision

CRITICAL: Return ONLY a JSON array of strings. No markdown, no explanation.
["question 1", "question 2", ...]

Make questions specific and actionable, not generic.`;

  const userMsg = `CEO asked: "${question}"

Round 1 perspectives:
${r1Summary}

Round 2 cross-examination:
${r2Summary}

Generate follow-up questions as JSON array.`;

  try {
    const rawResponse = await callClaude(systemPrompt, userMsg, apiKey);

    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('Expected array');

    return parsed.filter((q: any) => typeof q === 'string');
  } catch (err) {
    console.error('Suggestions parse error:', err);
    return [
      'What would you need to see to feel confident moving forward?',
      'What is the biggest risk we haven\'t discussed?',
      'If we could only do one thing in the next 90 days, what should it be?',
    ];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured. Add ANTHROPIC_API_KEY to your Supabase project secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.phase) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: phase is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result: any;

    switch (body.phase) {
      case 'round1':
        if (!body.question || !body.selectedAdvisors) {
          throw new Error('round1 requires question and selectedAdvisors');
        }
        const r1Responses = await handleRound1(
          body.question,
          body.companyContext,
          body.selectedAdvisors,
          body.conversationHistory,
          apiKey,
        );
        result = { responses: r1Responses };
        break;

      case 'round2':
        if (!body.question || !body.round1Responses || !body.selectedAdvisors) {
          throw new Error('round2 requires question, round1Responses, and selectedAdvisors');
        }
        const r2Responses = await handleRound2(
          body.question,
          body.companyContext,
          body.round1Responses,
          body.selectedAdvisors,
          body.conversationHistory,
          apiKey,
        );
        result = { responses: r2Responses };
        break;

      case 'suggestions':
        if (!body.question || !body.round1Responses || !body.round2Responses) {
          throw new Error('suggestions requires question, round1Responses, and round2Responses');
        }
        const suggestions = await handleSuggestions(
          body.question,
          body.round1Responses,
          body.round2Responses,
          apiKey,
        );
        result = { suggestedQuestions: suggestions };
        break;

      default:
        throw new Error(`Unknown phase: ${body.phase}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
