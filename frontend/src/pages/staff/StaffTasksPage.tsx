import { useState } from 'react';
import { ClipboardList, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import StatCard from '@/components/StatCard';

const initialTasks = [
  { id: 1, title: 'Complete curriculum review', description: 'Review and update the CS101 curriculum for the upcoming semester', status: 'completed', priority: 'high', dueDate: '2026-03-01', category: 'Academic' },
  { id: 2, title: 'Submit research proposal', description: 'Draft and submit NIH grant proposal for machine learning research', status: 'in-progress', priority: 'high', dueDate: '2026-03-15', category: 'Research' },
  { id: 3, title: 'Grade midterm exams', description: 'Grade and provide feedback for 120 midterm papers', status: 'in-progress', priority: 'medium', dueDate: '2026-03-10', category: 'Academic' },
  { id: 4, title: 'Attend faculty meeting', description: 'Monthly departmental faculty meeting', status: 'pending', priority: 'low', dueDate: '2026-03-20', category: 'Administrative' },
  { id: 5, title: 'Update course materials', description: 'Upload new lecture slides and reading list for CS202', status: 'pending', priority: 'medium', dueDate: '2026-03-25', category: 'Academic' },
  { id: 6, title: 'Student advising sessions', description: 'Meet with 15 assigned students for semester advising', status: 'completed', priority: 'high', dueDate: '2026-02-28', category: 'Advising' },
  { id: 7, title: 'Lab equipment requisition', description: 'Submit purchase order for new lab workstations', status: 'pending', priority: 'medium', dueDate: '2026-03-30', category: 'Administrative' },
  { id: 8, title: 'Peer review journal article', description: 'Review submitted manuscript for IEEE journal', status: 'in-progress', priority: 'high', dueDate: '2026-03-12', category: 'Research' },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  'in-progress': 'bg-warning/10 text-warning',
  pending: 'bg-muted text-muted-foreground',
};

const priorityStyles: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-muted text-muted-foreground',
};

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '', category: 'Academic' });

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  const cycleStatus = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id !== id) return t;
      const next = t.status === 'pending' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'pending';
      return { ...t, status: next };
    }));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'pending' }]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', category: 'Academic' });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your assignments</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tasks" value={tasks.length} icon={ClipboardList} color="primary" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="success" />
        <StatCard title="In Progress" value={inProgress} icon={Clock} color="warning" />
        <StatCard title="Pending" value={pending} icon={AlertCircle} color="accent" />
      </div>

      {/* Add task form */}
      {showAdd && (
        <div className="chart-card mb-6 animate-fade-in">
          <h3 className="font-display font-semibold text-foreground mb-4">New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} placeholder="Description" className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="flex gap-2">
              <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button onClick={addTask} className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'in-progress', 'completed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === s ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {filtered.map((task, i) => (
          <div key={task.id} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <button onClick={() => cycleStatus(task.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${task.status === 'completed' ? 'bg-success border-success' : task.status === 'in-progress' ? 'border-warning' : 'border-border'}`}>
                {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-success-foreground" />}
                {task.status === 'in-progress' && <div className="w-2 h-2 rounded-full bg-warning" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}>{task.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>📅 {task.dueDate}</span>
                  <span>📁 {task.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No tasks found</div>
        )}
      </div>
    </div>
  );
}
