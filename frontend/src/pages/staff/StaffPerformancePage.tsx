import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { Award, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { getStaffList } from '@/data/dataManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from 'recharts';

const myMetrics = {
  overallScore: 88,
  teachingScore: 92,
  researchScore: 85,
  serviceScore: 78,
  rank: 2,
  totalPeers: 6,
};

const monthlyProgress = [
  { month: 'Oct', score: 82 },
  { month: 'Nov', score: 84 },
  { month: 'Dec', score: 85 },
  { month: 'Jan', score: 87 },
  { month: 'Feb', score: 86 },
  { month: 'Mar', score: 88 },
];

const radarData = [
  { subject: 'Teaching', A: 92, fullMark: 100 },
  { subject: 'Research', A: 85, fullMark: 100 },
  { subject: 'Service', A: 78, fullMark: 100 },
  { subject: 'Leadership', A: 88, fullMark: 100 },
  { subject: 'Innovation', A: 90, fullMark: 100 },
  { subject: 'Collaboration', A: 82, fullMark: 100 },
];

const achievements = [
  { title: 'Top Researcher Q4 2025', date: '2025-12-20', badge: '🏆' },
  { title: 'Student Favorite Award', date: '2025-11-15', badge: '⭐' },
  { title: '10 Publications Milestone', date: '2025-09-01', badge: '📚' },
  { title: 'Perfect Attendance Semester', date: '2025-06-30', badge: '✅' },
];

export default function StaffPerformancePage() {
  const [peerData, setPeerData] = useState<any[]>([]);

  useEffect(() => {
    getStaffList().then(list => {
      const dynamicStaffPerformance = list.map(s => {
        const baseScore = (s.rating || 0) * 20;
        return {
          name: s.name.split(' ')[0] || s.name,
          overall: baseScore
        };
      });
      setPeerData(dynamicStaffPerformance);
    }).catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">My Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your performance metrics and achievements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Overall Score" value={myMetrics.overallScore} icon={Award} trend={{ value: 3.5, positive: true }} color="primary" />
        <StatCard title="Teaching" value={myMetrics.teachingScore} icon={Target} color="success" />
        <StatCard title="Research" value={myMetrics.researchScore} icon={TrendingUp} color="accent" />
        <StatCard title="Peer Rank" value={`#${myMetrics.rank} of ${myMetrics.totalPeers}`} icon={BarChart3} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar */}
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Skills Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
              <Radar dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Progress */}
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Monthly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} domain={[75, 95]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5, fill: '#0ea5e9' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peer comparison */}
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Peer Comparison</h3>
          {peerData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="overall" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
               No peer entries found.
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="text-2xl">{a.badge}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
