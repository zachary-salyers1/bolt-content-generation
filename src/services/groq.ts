import { Groq } from '@groq/groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY
});

const PLATFORM_SPECS = {
  x: { maxLength: 280, style: 'concise and engaging' },
  instagram: { maxLength: 2200, style: 'visual and engaging' },
  linkedin: { maxLength: 3000, style: 'professional and detailed' }
};

export async function generateContent(topic: string, platform: string, tone: string): Promise<string> {
  const spec = PLATFORM_SPECS[platform as keyof typeof PLATFORM_SPECS];
  
  const prompt = `Create a ${tone} social media post for ${platform} about: ${topic}.
    Maximum length: ${spec.maxLength} characters.
    Style: ${spec.style}
    Include relevant emojis where appropriate.
    Format the text with proper spacing and line breaks.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || '';
}

export async function generateHashtags(topic: string, platform: string): Promise<string[]> {
  const prompt = `Generate 5 relevant, trending hashtags for a ${platform} post about: ${topic}.
    Format: Return only the hashtags, separated by commas, without explanations.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 256,
  });

  const hashtags = completion.choices[0]?.message?.content?.split(',') || [];
  return hashtags.map(tag => tag.trim()).filter(tag => tag.startsWith('#'));
}

export async function suggestPostingTimes(platform: string): Promise<string[]> {
  const prompt = `What are the 2 best times to post on ${platform} for maximum engagement?
    Format: Return only the times in format "Day HH:MM AM/PM", separated by comma.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 128,
  });

  return completion.choices[0]?.message?.content?.split(',').map(time => time.trim()) || [];
}