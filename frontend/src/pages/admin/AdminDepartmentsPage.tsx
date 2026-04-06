import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { Building2, Users, GraduationCap, DollarSign } from 'lucide-react';
import { departmentStats } from '@/data/sampleData';
import { getStaffList, getStudentList } from '@/data/dataManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

export default function AdminDepartmentsPage() {
  const [selected, setSelected] = useState<typeof departmentStats[0] | null>(null);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [avgRating, setAvgRating] = useState('0.0');
  const [stats, setStats] = useState(departmentStats);

  useEffect(() => {
    Promise.all([getStaffList(), getStudentList()])
      .then(([staff, students]) => {
        setTotalFaculty(staff.length);
        if (staff.length > 0) {
          const ratingSum = staff.reduce((acc, s) => acc + (s.rating || 0), 0);
          setAvgRating((ratingSum / staff.length).toFixed(1));
        } else {
          setAvgRating('0.0');
        }

        const updatedStats = departmentStats.map(dept => {
          const deptStaff = staff.filter(s => s.department === dept.name);
          const deptStudents = students.filter(s => s.department === dept.name);
          const deptFacultyCount = deptStaff.length;
          const deptRatingSum = deptStaff.reduce((acc, s) => acc + (s.rating || 0), 0);
          return {
            ...dept,
            students: deptStudents.length,
            faculty: deptFacultyCount,
            rating: deptFacultyCount > 0 ? Number((deptRatingSum / deptFacultyCount).toFixed(1)) : 0
          };
        });
        setStats(updatedStats);
      })
      .catch(console.error);
  }, []);

  const totalStudents = stats.reduce((a, d) => a + d.students, 0);
  const totalBudget = stats.reduce((a, d) => a + d.budget, 0);

  const budgetData = stats.map(d => ({ name: d.name, value: d.budget }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Department Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of all institutional departments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Departments" value={stats.length} icon={Building2} color="primary" />
        <StatCard title="Total Students" value={totalStudents.toLocaleString()} icon={GraduationCap} color="success" />
        <StatCard title="Total Faculty" value={totalFaculty} icon={Users} color="accent" />
        <StatCard title="Avg Rating" value={avgRating} icon={DollarSign} color="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Students by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="students" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="faculty" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Budget Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={budgetData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name }) => name.split(' ')[0]}>
                {budgetData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `$${(v / 1e6).toFixed(1)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((dept, i) => (
          <div
            key={dept.name}
            className="stat-card cursor-pointer animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={() => setSelected(dept)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length] }}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">{dept.rating} ★</span>
            </div>
            <h3 className="font-display font-semibold text-foreground">{dept.name}</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div>
                <p className="text-lg font-bold text-foreground">{dept.students}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{dept.faculty}</p>
                <p className="text-xs text-muted-foreground">Faculty</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">${(dept.budget / 1e6).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Budget</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="glass-card p-6 w-full max-w-lg mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">{selected.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">Department Details</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-3xl font-display font-bold text-foreground">{selected.students}</p>
                <p className="text-xs text-muted-foreground mt-1">Enrolled Students</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-3xl font-display font-bold text-foreground">{selected.faculty}</p>
                <p className="text-xs text-muted-foreground mt-1">Faculty Members</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-3xl font-display font-bold text-foreground">${(selected.budget / 1e6).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground mt-1">Annual Budget</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-3xl font-display font-bold text-foreground">{selected.rating}</p>
                <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mb-6">
              <p className="text-xs font-medium text-primary mb-1">Student-Faculty Ratio</p>
              <p className="text-2xl font-display font-bold text-foreground">{(selected.students / selected.faculty).toFixed(1)} : 1</p>
            </div>
            <button onClick={() => setSelected(null)} className="w-full py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
