import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ManagementSidebar from '@/components/ManagementSidebar';
import StatCard from '@/components/StatCard';
import { TrendingUp, DollarSign, Users, Award, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { institutionalAnalytics, budgetDistribution, quarterlyRevenue, staffPerformance, decisionInsights } from '@/data/sampleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './profile/ProfilePage';
import EditProfilePage from './profile/EditProfilePage';
import { getStudentList, getStaffList } from '@/data/dataManager';
import ManagementInsightsPage from './management/ManagementInsightsPage';
import ManagementBudgetPage from './management/ManagementBudgetPage';
import ManagementPerformancePage from './management/ManagementPerformancePage';

const COLORS = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

function ManagementOverview() {
  const { totalBudget, graduationRate, researchGrants } = institutionalAnalytics;
  const [totalStudents, setTotalStudents] = useState<number>(institutionalAnalytics.totalStudents);
  const [staffChartData, setStaffChartData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [students, staff] = await Promise.all([getStudentList(), getStaffList()]);
        setTotalStudents(students ? students.length : 0);
        
        if (staff) {
          const dynamicStaffPerformance = staff.map(s => {
            const baseScore = (s.rating || 0) * 20; // Scale 0-5 to 0-100
            return {
              name: s.name.split(' ')[0] || s.name, // Keep it short for the chart
              teaching: baseScore,
              research: Math.max(0, baseScore - (Math.random() * 15)),
              overall: baseScore
            };
          });
          setStaffChartData(dynamicStaffPerformance);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const trendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-success" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Management Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Strategic insights and decision support</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={totalStudents.toLocaleString()} icon={Users} trend={{ value: 8.5, positive: true }} color="primary" />
        <StatCard title="Total Budget" value={`$${(totalBudget / 1e6).toFixed(0)}M`} icon={DollarSign} color="warning" />
        <StatCard title="Graduation Rate" value={`${graduationRate}%`} icon={Award} trend={{ value: 2.1, positive: true }} color="success" />
        <StatCard title="Research Grants" value={`$${(researchGrants / 1e6).toFixed(1)}M`} icon={TrendingUp} trend={{ value: 12.3, positive: true }} color="accent" />
      </div>

      {/* Decision Insights */}
      <div className="chart-card mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Decision Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decisionInsights.map((insight, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{insight.area}</span>
                <div className="flex items-center gap-1">
                  {trendIcon(insight.trend)}
                  <span className={`text-xs font-medium ${insight.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {insight.change > 0 ? '+' : ''}{insight.change}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue */}
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Quarterly Financials</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => `$${(v/1e6).toFixed(2)}M`} />
              <Legend />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4,4,0,0]} />
              <Bar dataKey="profit" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Pie */}
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={budgetDistribution} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {budgetDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Performance comparison */}
      <div className="chart-card">
        <h3 className="font-display font-semibold text-foreground mb-4">Staff Performance Overview</h3>
        {staffChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={staffChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="teaching" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="research" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="overall" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            No staff entries found in the system. Add staff in the Admin Dashboard.
          </div>
        )}
      </div>
    </>
  );
}

export default function ManagementDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <ManagementSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route index element={<ManagementOverview />} />
            <Route path="insights" element={<ManagementInsightsPage />} />
            <Route path="budget" element={<ManagementBudgetPage />} />
            <Route path="performance" element={<ManagementPerformancePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
