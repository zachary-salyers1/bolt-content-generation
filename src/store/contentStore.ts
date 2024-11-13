import { create } from 'zustand';
import { ContentRequest, GeneratedPost } from '../types/content';
import { generateContent, generateHashtags, suggestPostingTimes } from '../services/groq';

interface ContentStore {
  loading: boolean;
  error: string | null;
  generatedPost: GeneratedPost | null;
  generatePost: (request: ContentRequest) => Promise<void>;
}

export const useContentStore = create<ContentStore>((set) => ({
  loading: false,
  error: null,
  generatedPost: null,
  generatePost: async (request: ContentRequest) => {
    set({ loading: true, error: null });
    try {
      const [content, hashtags, bestTimes] = await Promise.all([
        generateContent(request.topic, request.platform, request.tone),
        generateHashtags(request.topic, request.platform),
        suggestPostingTimes(request.platform)
      ]);

      const images = [
        {
          url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
          alt: 'Productivity'
        },
        {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
          alt: 'Team collaboration'
        }
      ];

      set({
        loading: false,
        generatedPost: { content, hashtags, images, bestTimes }
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  }
}));