import React, { useState } from 'react';
import { Heart, Home, BarChart3, MessageCircle, User } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing');
  const [name, setName] = useState('');

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Noah</h1>
            <p className="text-2xl text-gray-600">Your GLP-1 Companion</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Noah!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your personal AI companion for Wegovy pill tracking.
            </p>
            
            <input
              type="text"
              placeholder="Enter your name to start"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-md mx-auto px-4 py-3 border-2 border-gray-200 rounded-xl mb-4"
            />
            
            <button
              onClick={() => name && setView('app')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Hey {name}! 👋</h1>
          <p className="text-lg opacity-90">Welcome to Noah</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Heart className="w-24 h-24 text-blue-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 It Works!
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Your Noah app is successfully running!
          </p>
          <p className="text-gray-500">
            Next we'll deploy this to the internet!
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}