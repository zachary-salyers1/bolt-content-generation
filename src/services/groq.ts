import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const PLATFORM_SPECS = {
  x: { maxLength: 280, style: 'concise and engaging' },
  instagram: { maxLength: 2200, style: 'visual and engaging' },
  linkedin: { maxLength: 3000, style: 'professional and detailed' }
};

interface ImageSuggestion {
  url: string;
  alt: string;
  description: string;
}

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
  const prompt = `Generate 5-7 highly relevant and trending hashtags for a ${platform} post about: ${topic}.
    Consider:
    - Industry-specific hashtags
    - Trending hashtags in this space
    - Mix of popular and niche hashtags
    - Platform-specific best practices (e.g., Instagram allows up to 30 hashtags)
    
    Format: Return only the hashtags, separated by commas, without explanations.
    Each hashtag must start with #.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0.8,
    max_tokens: 256,
  });

  const hashtags = completion.choices[0]?.message?.content?.split(',') || [];
  return hashtags
    .map(tag => tag.trim())
    .filter(tag => tag.startsWith('#'))
    .slice(0, 7);
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

export async function generateImageSuggestions(topic: string, platform: string): Promise<ImageSuggestion[]> {
  const prompt = `Suggest 1 perfect stock photo for a ${platform} post about: ${topic}.
    Provide:
    1. A descriptive search query (2-3 specific words)
    2. A brief description of what the image should show
    3. Alt text for accessibility

    Format: Return a JSON object containing:
    {
      "query": "specific search terms",
      "description": "what the image shows",
      "alt": "alt text"
    }`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 256,
  });

  try {
    const suggestion = JSON.parse(completion.choices[0]?.message?.content || '{}');
    const random = Math.floor(Math.random() * 1000);
    const query = suggestion.query.toLowerCase().trim().replace(/\s+/g, '-');
    
    return [{
      url: `https://source.unsplash.com/featured/800x600?${query}&sig=${random}`,
      alt: suggestion.alt,
      description: suggestion.description
    }];
  } catch (error) {
    console.error('Failed to parse image suggestion:', error);
    return [{
      url: `https://source.unsplash.com/featured/800x600?business-automation&sig=${Math.random() * 1000}`,
      alt: `Business automation representing ${topic}`,
      description: 'Modern business automation and technology'
    }];
  }
}