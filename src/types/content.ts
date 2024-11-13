export type Platform = 'x' | 'instagram' | 'linkedin';
export type Tone = 'professional' | 'casual' | 'friendly' | 'formal';

export interface ContentRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
}

export interface GeneratedPost {
  content: string;
  hashtags: string[];
  images: {
    url: string;
    alt: string;
  }[];
  bestTimes: string[];
}