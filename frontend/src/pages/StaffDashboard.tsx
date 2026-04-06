import Navbar from '@/components/Navbar';
import StaffSidebar from '@/components/StaffSidebar';
import StatCard from '@/components/StatCard';
import { ClipboardList, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { staffTasks, staffPerformance, departmentStats } from '@/data/sampleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Routes, Route } from 'react-router-dom';
import StaffTasksPage from './staff/StaffTasksPage';
import StaffPerformancePage from './staff/StaffPerformancePage';
import StaffReportsPage from './staff/StaffReportsPage';
import StaffStudentsPage from './staff/StaffStudentsPage';
import StaffStudentPerformancePage from './staff/StaffStudentPerformancePage';
import StaffStudentRecordsPage from './staff/StaffStudentRecordsPage';
import ProfilePage from './profile/ProfilePage';
import EditProfilePage from './profile/EditProfilePage';

const statusColor: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  'in-progress': 'bg-warning/10 text-warning',
  pending: 'bg-muted text-muted-foreground',
};

const priorityColor: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-muted text-muted-foreground',
};

function StaffOverview() {
  const completed = staffTasks.filter(t => t.status === 'completed').length;
  const inProgress = staffTasks.filter(t => t.status === 'in-progress').length;
  const pending = staffTasks.filter(t => t.status === 'pending').length;

  const radarData = [
    { subject: 'Teaching', A: 88 },
    { subject: 'Research', A: 82 },
    { subject: 'Service', A: 78 },
    { subject: 'Leadership', A: 85 },
    { subject: 'Innovation', A: 90 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your tasks and performance overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tasks" value={staffTasks.length} icon={ClipboardList} color="primary" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} color="success" />
        <StatCard title="In Progress" value={inProgress} icon={Clock} color="warning" />
        <StatCard title="Pending" value={pending} icon={BarChart3} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Tasks</h3>
          <div className="space-y-3">
            {staffTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Due: {task.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[task.status]}`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Performance Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="font-display font-semibold text-foreground mb-4">Department Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Bar dataKey="students" fill="#0ea5e9" radius={[4,4,0,0]} />
            <Bar dataKey="faculty" fill="#8b5cf6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <StaffSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route index element={<StaffOverview />} />
            <Route path="students" element={<StaffStudentsPage />} />
            <Route path="student-performance" element={<StaffStudentPerformancePage />} />
            <Route path="student-records" element={<StaffStudentRecordsPage />} />
            <Route path="tasks" element={<StaffTasksPage />} />
            <Route path="performance" element={<StaffPerformancePage />} />
            <Route path="reports" element={<StaffReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
