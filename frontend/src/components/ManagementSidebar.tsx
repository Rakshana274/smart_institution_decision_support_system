import { Link, useLocation } from 'react-router-dom';
import { BarChart3, LayoutDashboard, TrendingUp, DollarSign, Users, User } from 'lucide-react';

const links = [
  { to: '/management', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/management/insights', icon: TrendingUp, label: 'Insights' },
  { to: '/management/budget', icon: DollarSign, label: 'Budget' },
  { to: '/management/performance', icon: Users, label: 'Staff Performance' },
  { to: '/management/profile', icon: User, label: 'Profile' },
];

export default function ManagementSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] gradient-sidebar p-4">
      <div className="mb-8 px-4">
        <h2 className="font-display font-bold text-sidebar-foreground text-lg">Management</h2>
        <p className="text-xs text-sidebar-foreground/50 mt-1">Decision Support</p>
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
