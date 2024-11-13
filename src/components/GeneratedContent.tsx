import React from 'react';
import { Clock, Hash, Image as ImageIcon, Copy } from 'lucide-react';
import { useContentStore } from '../store/contentStore';

export default function GeneratedContent() {
  const [copied, setCopied] = React.useState(false);
  const { generatedPost, error } = useContentStore();

  const handleCopy = () => {
    if (generatedPost?.content) {
      navigator.clipboard.writeText(generatedPost.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-2xl p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!generatedPost) return null;

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Post</h3>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        
        <div className="prose prose-blue">
          <p className="text-gray-800 whitespace-pre-line">
            {generatedPost.content}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-700 mb-3">
            <Hash className="w-5 h-5" />
            <h4 className="font-medium">Suggested Hashtags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedPost.hashtags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-700 mb-3">
            <ImageIcon className="w-5 h-5" />
            <h4 className="font-medium">Image Suggestions</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {generatedPost.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt}
                className="w-full h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-700 mb-3">
            <Clock className="w-5 h-5" />
            <h4 className="font-medium">Best Time to Post</h4>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Recommended times:</p>
            <div className="flex flex-wrap gap-2">
              {generatedPost.bestTimes.map((time, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {time}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}