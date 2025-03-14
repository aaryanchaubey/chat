import React from 'react';
import { useTasksStore } from '@/lib/store/tasks.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';

export function ShoppingList() {
  const [newItem, setNewItem] = React.useState('');
  const { user } = useAuthStore();
  const { tasks, addTask, updateTask, deleteTask, getTasksByCoupleId } = useTasksStore();

  const shoppingTasks = user?.partnerId
    ? getTasksByCoupleId(`${user.id}-${user.partnerId}`).filter(
        (task) => task.category === 'shopping'
      )
    : [];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim() || !user?.id || !user?.partnerId) return;

    addTask({
      title: newItem,
      description: '',
      dueDate: new Date().toISOString(),
      completed: false,
      assignedTo: [user.id, user.partnerId],
      category: 'shopping',
      priority: 'medium',
      createdBy: user.id,
      coupleId: `${user.id}-${user.partnerId}`,
    });

    setNewItem('');
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <ShoppingCart className="w-6 h-6 text-pink-500 mr-2" />
          <h2 className="text-2xl font-semibold">Shopping List</h2>
        </div>

        <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            className="flex-1"
          />
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="space-y-2">
          {shoppingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task.id, { completed: !task.completed })}
                  className="mr-3 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                />
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}