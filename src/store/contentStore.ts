import { create } from 'zustand';
import { ContentRequest, GeneratedPost } from '../types/content';
import { generateContent, generateHashtags, suggestPostingTimes, generateImageSuggestions } from '../services/groq';

interface ContentStore {
  loading: boolean;
  error: string | null;
  generatedPost: GeneratedPost | null;
  generatePost: (request: ContentRequest) => Promise<void>;
  toggleHashtag: (hashtag: string) => void;
  updatePostWithHashtags: () => Promise<void>;
}

// Helper function to clean AI-generated text
const cleanGeneratedText = (text: string): string => {
  return text
    // Remove unwanted special characters while preserving emojis and formatting
    .replace(/[^\x20-\x7E\n\t\u2028\u2029\u0085\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, '')
    // Preserve bold with proper spacing
    .replace(/\*\*(.*?)\*\*/g, (_, p1) => `**${p1}**`)
    // Preserve italics with proper spacing
    .replace(/\*(.*?)\*/g, (_, p1) => `*${p1}*`)
    // Fix multiple consecutive newlines (but preserve intentional spacing)
    .replace(/\n{4,}/g, '\n\n\n')
    // Fix multiple spaces while preserving indentation
    .replace(/[ ]{3,}/g, '  ')
    // Ensure proper spacing after punctuation
    .replace(/([.!?])([^\s\n])/g, '$1 $2')
    // Clean up any remaining edge cases
    .trim();
};

export const useContentStore = create<ContentStore>((set, get) => ({
  loading: false,
  error: null,
  generatedPost: null,

  generatePost: async (request: ContentRequest) => {
    set({ loading: true, error: null });
    try {
      const [content, hashtags, bestTimes, imageSuggestions] = await Promise.all([
        generateContent(request.topic, request.platform, request.tone),
        generateHashtags(request.topic, request.platform),
        suggestPostingTimes(request.platform),
        generateImageSuggestions(request.topic, request.platform)
      ]);

      set({
        loading: false,
        generatedPost: { 
          content: cleanGeneratedText(content), 
          hashtags: hashtags.map(cleanGeneratedText), 
          selectedHashtags: [], 
          images: imageSuggestions, 
          bestTimes: bestTimes.map(cleanGeneratedText)
        }
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  },

  toggleHashtag: (hashtag: string) => {
    const post = get().generatedPost;
    if (!post) return;

    const selectedHashtags = post.selectedHashtags.includes(hashtag)
      ? post.selectedHashtags.filter(h => h !== hashtag)
      : [...post.selectedHashtags, hashtag];

    set({
      generatedPost: { ...post, selectedHashtags }
    });
  },

  updatePostWithHashtags: async () => {
    const post = get().generatedPost;
    if (!post) return;

    const hashtagString = post.selectedHashtags.join(' ');
    const updatedContent = cleanGeneratedText(`${post.content}\n\n${hashtagString}`);

    set({
      generatedPost: { ...post, content: updatedContent }
    });
  }
}));