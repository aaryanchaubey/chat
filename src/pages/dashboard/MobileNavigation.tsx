import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, ShoppingCart, Activity, Target, Settings } from 'lucide-react';

export function MobileNavigation() {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Heart, path: '/dashboard', label: 'Home' },
    { icon: MessageCircle, path: '/dashboard/chat', label: 'Chat' },
    { icon: ShoppingCart, path: '/dashboard/shopping', label: 'Shopping' },
    { icon: Activity, path: '/dashboard/health', label: 'Health' },
    { icon: Target, path: '/dashboard/goals', label: 'Goals' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}