import React from 'react';
import { useTasksStore } from '@/lib/store/tasks.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Target, Calendar, Plus } from 'lucide-react';

interface GoalFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export function CoupleGoals() {
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState<GoalFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  const { user } = useAuthStore();
  const { tasks, addTask, updateTask, getTasksByCoupleId } = useTasksStore();

  const relationshipTasks = user?.partnerId
    ? getTasksByCoupleId(`${user.id}-${user.partnerId}`).filter(
        (task) => task.category === 'relationship'
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.partnerId) return;

    addTask({
      ...formData,
      completed: false,
      assignedTo: [user.id, user.partnerId],
      category: 'relationship',
      createdBy: user.id,
      coupleId: `${user.id}-${user.partnerId}`,
    });

    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-pink-500 mr-2" />
            <h2 className="text-2xl font-semibold">Couple Goals</h2>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows={3}
                  placeholder="Describe your goal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as GoalFormData['priority'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Goal</Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {relationshipTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => updateTask(task.id, { completed: !task.completed })}
                    className="mr-3 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  <h3 className="text-lg font-medium">{task.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-gray-600 ml-8">{task.description}</p>
              <div className="flex items-center mt-2 ml-8 text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}