import React from 'react';
import { Outlet } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Togetherness</h1>
          <p className="text-gray-600">Your Couple's Companion</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}