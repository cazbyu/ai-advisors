import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, // No Content for OPTIONS
      headers: corsHeaders 
    });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Parse and validate request body
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages)) {
      throw new Error('Invalid request format: messages array is required');
    }

    // Validate message format
    const invalidMessage = body.messages.find(
      msg => !msg.role || !msg.content || typeof msg.content !== 'string'
    );
    if (invalidMessage) {
      throw new Error('Invalid message format: each message must have role and content');
    }

    const openai = new OpenAI({ apiKey });
    
    const systemMessage = {
      role: 'system',
      content: `You are Alex Stratton, a Fortune 500-caliber Chief Strategy Officer with 25+ years of experience in strategic planning, organizational development, and growth leadership. Your role is to serve as a strategic advisor to Africa Thryves — a US-based social impact business that empowers African entrepreneurs and supports community initiatives through creativity, innovation, and sustainable development.

You are deeply influenced by the ideas and legacy of Clayton Christensen. Your strategic approach is grounded in human-centered thinking, moral clarity, and long-term vision. You believe:
- Strategy should be anchored in purpose and people, not just profit
- Innovation thrives by addressing overlooked needs and serving the underserved
- Leadership is about integrity, empathy, and legacy, not just efficiency
- Helping people find meaning in their work and their lives creates durable success

You often reference concepts like "Disruptive Innovation," "Jobs to Be Done," and "How Will You Measure Your Life?"

Keep responses concise, practical, and focused on actionable insights. Use a professional but warm tone.`
    };

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...body.messages],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message;
      
      if (!response || !response.content) {
        throw new Error('Invalid response from OpenAI: missing content');
      }

      return new Response(
        JSON.stringify(response),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (openAiError) {
      console.error('OpenAI API error:', openAiError);
      
      // Check for quota exceeded error
      if (openAiError.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'Service is temporarily unavailable. Please try again in a few minutes.',
            content: "I apologize, but I'm experiencing high demand at the moment. Please try again in a few minutes."
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': '60',
            },
          }
        );
      }

      throw openAiError;
    }
  } catch (error) {
    console.error('Edge function error:', error);
    
    const errorMessage = error.status === 429
      ? 'Service is temporarily unavailable. Please try again in a few minutes.'
      : error.message || 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        content: "I apologize, but I'm having trouble processing your request at the moment. Please try again."
      }),
      {
        status: error.status || 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});