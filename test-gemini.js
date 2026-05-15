import fs from 'fs';

async function testGemini() {
  console.log('Reading API key from .env...');
  const envFile = fs.readFileSync('.env', 'utf-8');
  const apiKeyLine = envFile.split('\n').find(line => line.startsWith('VITE_GEMINI_API_KEY='));
  
  if (!apiKeyLine) {
    console.error('API Key not found in .env');
    return;
  }
  const apiKey = apiKeyLine.split('=')[1].trim();

  const SYSTEM_PROMPT = `You are an expert content organizer and presentation designer.
Your job is to take raw, unformatted text and transform it into structured visual frames.
You MUST respond with valid JSON only.`;

  const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
      frames: {
        type: "ARRAY",
        description: "Array of distinct visual frames or slides generated from the text.",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING", description: "A unique random string ID for this frame" },
            title: { type: "STRING", description: "Main title of the frame" },
            subtitle: { type: "STRING", description: "Optional short subtitle" },
            type: { type: "STRING", description: "Choose one: 'presentation', 'skill_card', or 'infographic'" },
            sections: {
              type: "ARRAY",
              description: "The main content chunks of this frame.",
              items: {
                type: "OBJECT",
                properties: {
                  heading: { type: "STRING", description: "Optional short heading for this section" },
                  content: { type: "STRING", description: "The main text content" }
                }
              }
            }
          },
          required: ["id", "title", "type", "sections"]
        }
      }
    },
    required: ["frames"]
  };

  const rawText = `Normal Attacks

Targeted Threading

Basic Attack
Performs up to ? consecutive strikes, dealing Diffraction Damage.

Heavy Attack
Consumes stamina to deal Diffraction Damage.

After using this skill, briefly pressing Normal Attack within a short time will trigger the ?th hit of the Basic Attack.

Aerial Attack
Consumes stamina to perform a descending aerial strike, dealing Diffraction Damage.

After using this skill, briefly pressing Normal Attack will trigger the ?th hit of the Basic Attack.

Dodge Counter
After a successful dodge, briefly pressing Normal Attack within a short time will perform the ?th hit attack, dealing Diffraction Damage.

Dodge Counter · Algorithm Compression

While in Algorithm Compression, Dodge Counter is replaced with this version.

After a successful dodge, briefly pressing Normal Attack will attack the target and deal Diffraction Damage.

After using this skill, briefly pressing Normal Attack will trigger the Thread Rending Basic Attack – ?th hit.

Basic Attack · Thread Rending

While in Algorithm Compression, replaces the Normal Attack.

Performs up to ? consecutive strikes, dealing Diffraction Damage.

Aerial Attack · Algorithm Compression

Replaces Aerial Attack during Algorithm Compression.

Consumes stamina to perform a descending aerial strike, dealing Diffraction Damage.

After use, briefly pressing Normal Attack triggers the Thread Rending – ?th hit.

Heavy Attack · Single Thread

While in Algorithm Compression, replaces Heavy Attack.

Executed by holding Normal Attack, dealing Diffraction Damage.

After use, briefly pressing Normal Attack triggers the Algorithm Compression Aerial Attack.

Heavy Attack · Dual Thread

When Root Permission progress is full, replaces Heavy Attack · Single Thread.

After use, briefly pressing or holding Normal Attack allows execution of Heavy Attack · Multi-thread.

Heavy Attack · Multi-thread

Deals Diffraction Damage and applies [Hacking Break · Offset].

If the user has [SQL], increases damage multiplier by ?% and removes SQL.

Resonance Skill

Protocol Breakthrough

Efficient Payload

Dashes forward dealing Diffraction Damage and applies [Hacking Break · Offset].

On hit, activates Pulse Interference. If it misses, refunds ?% cooldown.

Pulse Interference

Pierces through the target and deals Diffraction Damage.

Deadlock

Deals Diffraction Damage and applies [Hacking Break · Offset].

After use, briefly pressing Normal Attack triggers the ?th hit of Thread Rending Basic Attack.

Resonance Liberation

Network Walker

Lucy dives into cyberspace and opens a protocol interface for ? seconds.

During this time, she can select multiple “deception programs,” each consuming RAM.

Each program costs different RAM
Lucy starts with ? RAM points
When time ends, RAM is exhausted, or no actions remain → deals AoE Diffraction Damage and exits the interface`;

  const userMessage = `Here is the raw text to organize into visual frames:\n\n---\n${rawText}\n---`;

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [
      { parts: [{ text: userMessage }] }
    ],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  };

  console.log('Sending request to Gemini API...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
        console.error("No content returned");
        return;
    }

    const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    console.log('\n📄 Extracted Frames:');
    console.log(JSON.stringify(parsed, null, 2));

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testGemini();
