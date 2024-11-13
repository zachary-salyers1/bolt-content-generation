import React from 'react';
import { Clock, Hash, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { useContentStore } from '../store/contentStore';

const formatContent = (content: string): string => {
  return content
    .split('\n')
    .map(line => {
      // Apply bold formatting
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Apply italic formatting
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return line;
    })
    .join('\n');
};

export default function GeneratedContent() {
  const [copied, setCopied] = React.useState(false);
  const { generatedPost, error, toggleHashtag, updatePostWithHashtags } = useContentStore();

  const [loadedImages, setLoadedImages] = React.useState<Set<number>>(new Set());
  const [retryCount, setRetryCount] = React.useState<Record<number, number>>({});

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

  const handleHashtagClick = (hashtag: string) => {
    toggleHashtag(hashtag);
  };

  const handleUpdatePost = () => {
    updatePostWithHashtags();
  };

  const handleImageError = (index: number) => {
    const currentRetries = retryCount[index] || 0;
    if (currentRetries < 3) {
      // Update retry count
      setRetryCount(prev => ({ ...prev, [index]: currentRetries + 1 }));
      
      // Generate a new random signature for the URL
      const random = Math.floor(Math.random() * 1000);
      const target = document.querySelector(`img[data-index="${index}"]`) as HTMLImageElement;
      if (target) {
        target.src = `https://source.unsplash.com/featured/800x600?business-technology&sig=${random}`;
      }
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Generated Content</h3>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="prose max-w-none">
          <pre 
            className="whitespace-pre-wrap text-sm text-gray-700 font-sans"
            dangerouslySetInnerHTML={{ 
              __html: formatContent(generatedPost.content) 
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5" />
              <h4 className="font-medium">Suggested Hashtags</h4>
            </div>
            <button
              onClick={handleUpdatePost}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Selected
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedPost.hashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleHashtagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  generatedPost.selectedHashtags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-700 mb-3">
            <ImageIcon className="w-5 h-5" />
            <h4 className="font-medium">Suggested Image</h4>
          </div>
          {generatedPost.images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  data-index={index}
                  src={image.url}
                  alt={image.alt}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
              <p className="text-sm text-gray-600">{image.description}</p>
              <p className="text-xs text-gray-500 italic">{image.alt}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-2 text-gray-700 mb-3">
            <Clock className="w-5 h-5" />
            <h4 className="font-medium">Best Time to Post</h4>
          </div>
          <div className="space-y-3">
            {generatedPost.bestTimes.map((time, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-blue-600 font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{time}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-3 italic">
              These times are based on global studies and may vary depending on your specific audience.
              It's recommended to test different times to find what works best for your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}