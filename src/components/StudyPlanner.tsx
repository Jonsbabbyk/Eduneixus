import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, CheckCircle, Trash2, Edit } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useUser } from '../contexts/UserContext';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  subject: string;
}

function StudyPlanner() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    subject: ''
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem(`study_tasks_${user?.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [user]);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(`study_tasks_${user?.id}`, JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      completed: false,
      priority: newTask.priority,
      subject: newTask.subject
    };

    saveTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      subject: ''
    });
    setShowAddTask(false);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const updateTask = () => {
    if (!editingTask || !newTask.title.trim()) return;

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id
        ? {
            ...task,
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate,
            priority: newTask.priority,
            subject: newTask.subject
          }
        : task
    );
    saveTasks(updatedTasks);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      subject: ''
    });
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      subject: task.subject
    });
    setShowAddTask(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const upcoming = tasks
      .filter(task => !task.completed && new Date(task.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
    return upcoming;
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const overdue = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;
    
    return { total, completed, overdue };
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-gray-600 text-sm">Total Tasks</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-gray-600 text-sm">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-gray-600 text-sm">Overdue</div>
        </Card>
      </div>

      {/* Add/Edit Task Form */}
      {showAddTask && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={newTask.subject}
                onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mathematics, Science"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Task description (optional)"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={editingTask ? updateTask : addTask}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddTask(false);
                setEditingTask(null);
                setNewTask({
                  title: '',
                  description: '',
                  dueDate: '',
                  priority: 'medium',
                  subject: ''
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Task Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Study Planner
          </h2>
          <Button onClick={() => setShowAddTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Upcoming Tasks */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
          {getUpcomingTasks().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No upcoming tasks. Add some to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingTasks().map((task) => (
                <div 
                  key={task.id}
                  className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && <CheckCircle className="h-3 w-3" />}
                      </button>
                      <div>
                        <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        {task.subject && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {task.subject}
                          </span>
                        )}
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Tasks */}
        {tasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
            <div className="space-y-2">
              {tasks
                .sort((a, b) => {
                  if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                  }
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                })
                .map((task) => (
                  <div 
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      task.completed ? 'bg-gray-50' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && <CheckCircle className="h-3 w-3" />}
                      </button>
                      <div>
                        <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </span>
                        {task.subject && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {task.subject}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.dueDate && (
                        <span className="text-sm text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default StudyPlanner;