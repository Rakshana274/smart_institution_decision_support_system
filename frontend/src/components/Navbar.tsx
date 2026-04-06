import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/data/store';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = user
    ? user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/management'
    : '/';

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">SIDSS</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to={dashboardPath} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-medium gradient-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {user ? (
              <div className="space-y-2">
                <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-muted">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm text-destructive hover:bg-muted">Logout</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-muted">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-muted">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
