/**
 * DeepSeek API Service
 * Handles communication with the DeepSeek chat completion API.
 * Reads the API key from VITE_DEEPSEEK_API_KEY env variable.
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `You are an expert content organizer and presentation designer.
Your job is to take raw, unformatted text and transform it into structured visual frames.

Rules:
1. Analyze the text and identify logical sections, topics, or items.
2. Create multiple frames — each frame should cover ONE focused topic.
3. Choose the best frame type for each section:
   - "presentation" — for general content, overviews, intros
   - "skill_card" — for game abilities, character stats, technical specs, feature lists
   - "infographic" — for comparisons, data, processes, step-by-step flows
4. Each frame must have a clear title and well-organized sections.
5. Keep text concise and punchy. Rewrite for clarity if needed.
6. Extract keywords, stats, and important values.
7. Each section should have a short heading and content text.
8. Generate at least 2 frames, but create as many as the content warrants.
9. Do NOT include any markdown formatting in the content text.

You MUST respond with valid JSON only — no markdown, no explanation, no code fences.`;

const RESPONSE_FORMAT = {
  frames: [
    {
      id: "unique_string_id",
      title: "Frame Title",
      subtitle: "Optional subtitle",
      type: "presentation | skill_card | infographic",
      sections: [
        {
          heading: "Section Heading",
          content: "Section content text"
        }
      ]
    }
  ]
};

/**
 * Generate structured frames from raw text using DeepSeek API.
 * @param {string} rawText - The unformatted input text
 * @returns {Promise<{frames: Array}>} Parsed frame data
 */
export async function generateFrames(rawText) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error('DeepSeek API key not configured. Add VITE_DEEPSEEK_API_KEY to your .env file.');
  }

  const userMessage = `Here is the raw text to organize into visual frames:

---
${rawText}
---

Respond with JSON matching this structure:
${JSON.stringify(RESPONSE_FORMAT, null, 2)}

Create as many frames as needed to cover all the content. Each frame should focus on one topic.`;

  const payload = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.4,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('DeepSeek API error:', errorBody);
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your VITE_DEEPSEEK_API_KEY.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited. Please wait a moment and try again.');
    }
    throw new Error(`API Error (${response.status}): ${response.statusText}`);
  }

  const result = await response.json();

  const content = result.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content in API response.');
  }

  let parsed;
  try {
    // Strip any accidental markdown code fences
    const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse AI response:', content);
    throw new Error('AI returned malformed JSON. Please try again.');
  }

  if (!parsed.frames || !Array.isArray(parsed.frames) || parsed.frames.length === 0) {
    throw new Error('AI returned no frames. Try providing more detailed text.');
  }

  // Ensure each frame has a unique ID
  const frames = parsed.frames.map((frame, idx) => ({
    ...frame,
    id: frame.id || `frame-${Date.now()}-${idx}`,
    type: frame.type || 'presentation',
    subtitle: frame.subtitle || '',
    sections: frame.sections || [],
  }));

  return { frames };
}
