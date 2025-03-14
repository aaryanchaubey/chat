import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Activity, MessageCircle, Settings, ShoppingCart, Target, Menu } from 'lucide-react';
import { Chat } from './chat/Chat';
import { HealthTracker } from './health/HealthTracker';
import { ShoppingList } from './tasks/ShoppingList';
import { CoupleGoals } from './goals/CoupleGoals';
import { MobileNavigation } from './MobileNavigation';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const navigation = [
    { name: 'Overview', icon: Heart, href: '/dashboard' },
    { name: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
    { name: 'Health', icon: Activity, href: '/dashboard/health' },
    { name: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
    { name: 'Shopping', icon: ShoppingCart, href: '/dashboard/shopping' },
    { name: 'Goals', icon: Target, href: '/dashboard/goals' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">
            {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          <img
            className="h-8 w-8 rounded-full"
            src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
            alt=""
          />
        </div>
      </div>

      <div className="flex h-screen pt-[60px] md:pt-0">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4">
                <Heart className="w-8 h-8 text-pink-500" />
                <span className="ml-2 text-xl font-semibold text-gray-800">
                  Togetherness
                </span>
              </div>
              <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Button>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.name}
                    </p>
                    <Button
                      variant="ghost"
                      className="text-xs text-gray-500 group-hover:text-gray-700"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden">
            <div className="bg-white w-64 h-full">
              {/* Mobile menu content */}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
            <Routes>
              <Route path="chat" element={<Chat />} />
              <Route path="health" element={<HealthTracker />} />
              <Route path="shopping" element={<ShoppingList />} />
              <Route path="goals" element={<CoupleGoals />} />
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}