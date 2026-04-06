import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import StatCard from '@/components/StatCard';
import { Users, Building2, GraduationCap, DollarSign, TrendingUp, Award } from 'lucide-react';
import { institutionalAnalytics, departmentStats, staffPerformance, budgetDistribution } from '@/data/sampleData';
import { getStudentList, getStaffList } from '@/data/dataManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Routes, Route } from 'react-router-dom';
import AdminStaffPage from './admin/AdminStaffPage';
import AdminStudentsPage from './admin/AdminStudentsPage';
import AdminDepartmentsPage from './admin/AdminDepartmentsPage';
import AdminReportsPage from './admin/AdminReportsPage';
import ProfilePage from './profile/ProfilePage';
import EditProfilePage from './profile/EditProfilePage';

const COLORS = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

function AdminOverview() {
  const { totalFaculty, totalDepartments, totalBudget, graduationRate, employmentRate } = institutionalAnalytics;
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [staffChartData, setStaffChartData] = useState<any[]>([]);

  const [dynamicDeptStats, setDynamicDeptStats] = useState(departmentStats);

  useEffect(() => {
    Promise.all([getStudentList(), getStaffList()])
      .then(([students, staff]) => {
        setTotalStudents(students.length);
        setTotalStaff(staff.length);
        
        const dynamicStaffPerformance = staff.map(s => {
          const baseScore = (s.rating || 0) * 20;
          return {
            name: s.name.split(' ')[0] || s.name,
            teaching: baseScore,
            research: Math.max(0, baseScore - (Math.random() * 15)),
            service: Math.max(0, baseScore - (Math.random() * 10))
          };
        });
        setStaffChartData(dynamicStaffPerformance);

        const updatedDeptStats = departmentStats.map(dept => {
          const deptStudents = students.filter(s => s.department === dept.name).length;
          const deptFaculty = staff.filter(s => s.department === dept.name).length;
          return { ...dept, students: deptStudents, faculty: deptFaculty };
        });
        
        // Also capture departments from DB that might not be in sample data
        const existingDeptNames = new Set(departmentStats.map(d => d.name));
        const allDepts = new Set([...students.map(s => s.department), ...staff.map(s => s.department)]);
        
        allDepts.forEach(deptName => {
          if (deptName && !existingDeptNames.has(deptName)) {
            const deptStudents = students.filter(s => s.department === deptName).length;
            const deptFaculty = staff.filter(s => s.department === deptName).length;
            updatedDeptStats.push({
              name: deptName,
              students: deptStudents,
              faculty: deptFaculty,
              budget: 1000000, // default
              rating: 4.0 // default
            });
          }
        });
        
        setDynamicDeptStats(updatedDeptStats);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Institutional overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Students" value={totalStudents} icon={GraduationCap} trend={{ value: 8.5, positive: true }} color="primary" />
        <StatCard title="Faculty" value={totalStaff} icon={Users} trend={{ value: 3.2, positive: true }} color="accent" />
        <StatCard title="Departments" value={totalDepartments} icon={Building2} color="success" />
        <StatCard title="Budget" value={`$${(totalBudget / 1e6).toFixed(0)}M`} icon={DollarSign} color="warning" />
        <StatCard title="Graduation" value={`${graduationRate}%`} icon={Award} trend={{ value: 2.1, positive: true }} color="success" />
        <StatCard title="Employment" value={`${employmentRate}%`} icon={TrendingUp} trend={{ value: 1.8, positive: true }} color="primary" />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Staff Performance</h3>
          {staffChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="teaching" fill="#0ea5e9" radius={[4,4,0,0]} />
                <Bar dataKey="research" fill="#8b5cf6" radius={[4,4,0,0]} />
                <Bar dataKey="service" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
              No staff entries found in the system. Add staff to view performance.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Budget Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={budgetDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {budgetDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card lg:col-span-2">
          <h3 className="font-display font-semibold text-foreground mb-4">Department Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Department</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">Students</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">Faculty</th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {dynamicDeptStats.map(d => (
                  <tr key={d.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{d.name}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{d.students}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{d.faculty}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">{d.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="staff" element={<AdminStaffPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="departments" element={<AdminDepartmentsPage />} />
            <Route path="analytics" element={<div>Removed</div>} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
