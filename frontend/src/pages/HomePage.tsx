import { Link } from 'react-router-dom';
import { useAuth } from '@/data/store';
import Navbar from '@/components/Navbar';
import { BarChart3, Shield, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const dashboardPath = user
    ? user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/management'
    : '/login';

  const features = [
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time data visualization and institutional metrics' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Secure dashboards tailored to Admin, Staff & Management' },
    { icon: Users, title: 'Staff Management', desc: 'Track performance, tasks, and departmental data' },
    { icon: TrendingUp, title: 'Decision Support', desc: 'AI-powered insights for strategic institutional planning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero py-24 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-medium text-primary">Smart Decision Making</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
            Smart Institutional<br />Decision Support System
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Empower your institution with data-driven insights, comprehensive analytics, and intelligent decision support tools.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={dashboardPath} className="gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block">
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Link>
            <Link to="/login" className="border border-primary-foreground/20 text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary-foreground/5 transition-colors inline-block">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="stat-card text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <p className="text-sm text-muted-foreground">© 2026 SIDSS — Smart Institutional Decision Support System</p>
      </footer>
    </div>
  );
}
