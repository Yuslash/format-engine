import fs from 'fs';

async function test() {
  console.log('Reading API key from .env...');
  const envFile = fs.readFileSync('.env', 'utf-8');
  const apiKeyLine = envFile.split('\n').find(line => line.startsWith('VITE_DEEPSEEK_API_KEY='));
  
  if (!apiKeyLine) {
    console.error('API Key not found in .env');
    return;
  }
  const apiKey = apiKeyLine.split('=')[1].trim();

  const SYSTEM_PROMPT = `You are an expert content organizer and presentation designer.
Your job is to take raw, unformatted text and transform it into structured visual frames.
You MUST respond with valid JSON only.`;

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

  const userMessage = `Here is the raw text to organize into visual frames:
---
Passive — Ghost Step: After dodging an attack, gain 30% movement speed for 2 seconds. Cooldown: 8s.
---
Respond with JSON matching this structure:
${JSON.stringify(RESPONSE_FORMAT, null, 2)}`;

  const payload = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.4,
    response_format: { type: 'json_object' }
  };

  console.log('Sending request to DeepSeek API...');
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('API Error, Status:', response.status);
      console.error('Error Body:', await response.text());
      return;
    }

    const data = await response.json();
    console.log('✅ API Request Successful!');
    
    const content = data.choices[0].message.content;
    const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    console.log('\n📄 Extracted Frames:');
    console.log(JSON.stringify(parsed, null, 2));

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
