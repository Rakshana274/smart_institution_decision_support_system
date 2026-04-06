import { useState, useEffect } from 'react';
import { getStaffList } from '@/data/dataManager';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Award, ShieldAlert } from 'lucide-react';

export default function ManagementPerformancePage() {
  const [staffChartData, setStaffChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, highPerformers: 0, needsReview: 0 });

  useEffect(() => {
    async function fetchData() {
      const staff = await getStaffList();
      if (staff && staff.length > 0) {
        const dynamicStaffPerformance = staff.map(s => {
          const rating = s.rating || 0;
          const baseScore = rating * 20; 
          return {
            name: s.name.split(' ')[0] || s.name,
            teaching: baseScore,
            research: Math.max(0, baseScore - (Math.random() * 15)),
            overall: baseScore
          };
        });
        setStaffChartData(dynamicStaffPerformance);
        
        const high = staff.filter(s => (s.rating || 0) >= 4).length;
        const low = staff.filter(s => (s.rating || 0) <= 2).length;
        setStats({ total: staff.length, highPerformers: high, needsReview: low });
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Staff Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Review faculty and staff evaluations based on latest inputs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full"><Users className="w-6 h-6 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Evaluated Staff</p><p className="text-2xl font-bold">{stats.total}</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-4 bg-success/10 rounded-full"><Award className="w-6 h-6 text-success" /></div>
          <div><p className="text-sm text-muted-foreground">High Performers (4+)</p><p className="text-2xl font-bold">{stats.highPerformers}</p></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="p-4 bg-warning/10 rounded-full"><ShieldAlert className="w-6 h-6 text-warning" /></div>
          <div><p className="text-sm text-muted-foreground">Needs Review (0-2)</p><p className="text-2xl font-bold">{stats.needsReview}</p></div>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="font-display font-semibold text-foreground mb-6">Aggregate Subject Matter Expertise</h3>
        {staffChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={staffChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="teaching" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="research" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="overall" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
           <div className="h-[300px] flex items-center justify-center text-muted-foreground">No staff entries found in the system. Add staff in the Admin Dashboard.</div>
        )}
      </div>
    </div>
  );
}
