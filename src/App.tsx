import React from 'react';
import { Sparkles } from 'lucide-react';
import ContentForm from './components/ContentForm';
import GeneratedContent from './components/GeneratedContent';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">PostCraft AI</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Engaging Social Media Content
          </h1>
          <p className="text-xl text-gray-600">
            Generate platform-optimized posts with AI-powered suggestions
          </p>
        </div>

        <div className="flex flex-col items-center space-y-12">
          <ContentForm />
          <GeneratedContent />
        </div>
      </main>

      <footer className="bg-white border-t mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 PostCraft AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;