import { Link } from 'react-router-dom';
import { useAuth } from '@/data/store';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { user } = useAuth();
  const dashboardPath = user
    ? user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/management'
    : '/login';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center animate-fade-in">
          <h1 className="mb-4 text-4xl font-display font-bold text-foreground">Welcome to SIDSS</h1>
          <p className="text-xl text-muted-foreground mb-8">Smart Institutional Decision Support System</p>
          <Link to={dashboardPath} className="gradient-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block">
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
