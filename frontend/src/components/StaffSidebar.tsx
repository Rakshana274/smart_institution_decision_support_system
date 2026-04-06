import { Link, useLocation } from 'react-router-dom';
import { BarChart3, ClipboardList, LayoutDashboard, FileText, Users, TrendingUp, FolderOpen, User } from 'lucide-react';

const links = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/students', icon: Users, label: 'My Students' },
  { to: '/staff/student-performance', icon: TrendingUp, label: 'Student Performance' },
  { to: '/staff/student-records', icon: FolderOpen, label: 'Student Records' },
  { to: '/staff/tasks', icon: ClipboardList, label: 'Tasks' },
  { to: '/staff/performance', icon: BarChart3, label: 'Performance' },
  { to: '/staff/reports', icon: FileText, label: 'Reports' },
  { to: '/staff/profile', icon: User, label: 'Profile' },
];

export default function StaffSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] gradient-sidebar p-4">
      <div className="mb-8 px-4">
        <h2 className="font-display font-bold text-sidebar-foreground text-lg">Staff Portal</h2>
        <p className="text-xs text-sidebar-foreground/50 mt-1">Work & Performance</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
