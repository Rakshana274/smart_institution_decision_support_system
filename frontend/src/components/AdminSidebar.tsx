import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Building2, LayoutDashboard, FileText, GraduationCap, User } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/staff', icon: Users, label: 'Staff' },
  { to: '/admin/students', icon: GraduationCap, label: 'Students' },
  { to: '/admin/departments', icon: Building2, label: 'Departments' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] gradient-sidebar p-4">
      <div className="mb-8 px-4">
        <h2 className="font-display font-bold text-sidebar-foreground text-lg">Admin Panel</h2>
        <p className="text-xs text-sidebar-foreground/50 mt-1">Institution Management</p>
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
