import { NextRequest, NextResponse } from 'next/server';
import {
  getAgentSystemPrompt,
  generateLocalFallbackResponse,
  findMatchingTrips,
  isTravelRelated,
} from '@/lib/agent-knowledge';

export const runtime = 'nodejs';

// Candidate models in priority order
const FALLBACK_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'allam-2-7b',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [] } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')?.content || '';
    const matchedTrips = findMatchingTrips(lastUserMessage);

    // Strict Domain Enforcement: immediately refuse non-travel queries
    if (!isTravelRelated(lastUserMessage)) {
      return NextResponse.json({
        role: 'assistant',
        content: `I am Zainab from **Nodebook Travels**.\n\nI can only assist with travel itineraries, holiday packages, destinations, pricing in PKR, and bookings.\n\nPlease let me know which travel destination or package you would like assistance with!`,
        matchedTrips: [],
      });
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    const configuredModel = process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-120b';

    // If no API key is provided, use the strict knowledge base fallback
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
      const fallback = generateLocalFallbackResponse(lastUserMessage);
      return NextResponse.json({
        role: 'assistant',
        content: fallback.reply,
        matchedTrips: fallback.matchedTrips.length > 0 ? fallback.matchedTrips : matchedTrips,
        isFallback: true,
        notice: 'Running in Knowledge-Base Offline Mode. Set GROQ_API_KEY in .env.local to activate Groq.',
      });
    }

    // Prepare strict system instructions with full package knowledge
    const systemPrompt = getAgentSystemPrompt();

    // Models to try in order
    const modelsToTry = [configuredModel, ...FALLBACK_MODELS.filter(m => m !== configuredModel)];

    let activeResponse: Response | null = null;
    let lastErrorStatus = 0;

    for (const modelToAttempt of modelsToTry) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelToAttempt,
            messages: [
              {
                role: 'system',
                content: `${systemPrompt}\n\nCRITICAL CONSTRAINTS (STRICT HUMAN PERSONA):\n- You are Zainab, senior travel consultant at Nodebook Travels.\n- Speak naturally as a real human. NEVER say you are an AI, bot, virtual assistant, or language model.\n- ONLY answer travel, tourism, destination, itinerary, hotel, package, pricing, and booking questions.\n- STRICTLY REFUSE any off-topic question (coding, math, essays, recipes, politics, general knowledge) in 1 sentence.\n- Be direct, concise, factual, and quote starting prices in PKR (e.g. PKR 32,500 / person).\n- Mention official WhatsApp +92 325 2551585 for bookings.`,
              },
              ...messages.slice(-8), // keep recent conversation history
            ],
            temperature: 0.2, // Low temperature for maximum adherence and strictness
            max_tokens: 800,
            stream: true,
          }),
        });

        if (response.ok) {
          activeResponse = response;
          break;
        } else {
          lastErrorStatus = response.status;
          console.warn(`Model ${modelToAttempt} failed with status ${response.status}. Trying next fallback model...`);
          if (response.status === 401) {
            break;
          }
        }
      } catch (err) {
        console.error(`Network error attempting model ${modelToAttempt}:`, err);
      }
    }

    if (!activeResponse || !activeResponse.ok) {
      console.error('All Groq models failed. Last status:', lastErrorStatus);

      // Gracefully fall back to local knowledge base
      const fallback = generateLocalFallbackResponse(lastUserMessage);
      return NextResponse.json({
        role: 'assistant',
        content: `${fallback.reply}\n\n*(Notice: Server returned status ${lastErrorStatus}. Displayed response from Nodebook Knowledge Base.)*`,
        matchedTrips: fallback.matchedTrips.length > 0 ? fallback.matchedTrips : matchedTrips,
        isFallback: true,
      });
    }

    // Stream response using SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial metadata with matched trips
        const metaChunk = `data: ${JSON.stringify({ meta: true, matchedTrips })}\n\n`;
        controller.enqueue(encoder.encode(metaChunk));

        if (!activeResponse?.body) {
          controller.close();
          return;
        }

        const reader = activeResponse.body.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;
              if (trimmed === 'data: [DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                break;
              }

              try {
                const json = JSON.parse(trimmed.slice(6));
                const textChunk = json.choices?.[0]?.delta?.content || '';
                if (textChunk) {
                  const outPayload = `data: ${JSON.stringify({ content: textChunk })}\n\n`;
                  controller.enqueue(encoder.encode(outPayload));
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        } catch (err) {
          console.error('Stream reading error:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Unhandled Chat API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while communicating with the travel consultant.' },
      { status: 500 }
    );
  }
}
