import React from 'react';
import { Send } from 'lucide-react';
import { Platform, Tone } from '../types/content';
import { useContentStore } from '../store/contentStore';

export default function ContentForm() {
  const [topic, setTopic] = React.useState('');
  const [platform, setPlatform] = React.useState<Platform>('linkedin');
  const [tone, setTone] = React.useState<Tone>('professional');
  
  const { loading, generatePost } = useContentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generatePost({ topic, platform, tone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to post about?
        </label>
        <textarea
          id="topic"
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="E.g., Announcing our new product feature that helps businesses automate their workflow..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <div className="space-y-2">
            {[
              { id: 'linkedin', label: 'LinkedIn' },
              { id: 'x', label: 'X (formerly Twitter)' },
              { id: 'instagram', label: 'Instagram' },
            ].map((item) => (
              <label key={item.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="platform"
                  value={item.id}
                  checked={platform === item.id}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !topic}
          className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium flex items-center space-x-2
            ${loading || !topic ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Generate Content</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}