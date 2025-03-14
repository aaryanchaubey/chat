import React from 'react';
import { useHealthStore } from '@/lib/store/health.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export function HealthTracker() {
  const { user } = useAuthStore();
  const { healthData, updateMenstrualData, addMoodEntry } = useHealthStore();

  if (user?.role !== 'female') {
    return (
      <div className="p-6 text-center">
        <p>This feature is only available for female users.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menstrual Cycle Tracker */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Menstrual Cycle</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Period Start Date
              </label>
              <input
                type="date"
                value={healthData.menstrualCycle.lastPeriod}
                onChange={(e) =>
                  updateMenstrualData({
                    ...healthData.menstrualCycle,
                    lastPeriod: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
            {/* Add more menstrual cycle tracking fields */}
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                How are you feeling today?
              </label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    onClick={() =>
                      addMoodEntry({
                        date: format(new Date(), 'yyyy-MM-dd'),
                        rating,
                        notes: '',
                      })
                    }
                    className={`w-10 h-10 ${
                      healthData.mood[healthData.mood.length - 1]?.rating === rating
                        ? 'bg-pink-100 border-pink-500'
                        : ''
                    }`}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
            {/* Add mood notes and history */}
          </div>
        </div>
      </div>

      {/* Wellness Tracker */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Wellness Tracker</h2>
        {/* Add wellness tracking components */}
      </div>
    </div>
  );
}