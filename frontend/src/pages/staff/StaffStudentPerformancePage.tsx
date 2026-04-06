import { useState, useEffect } from 'react';
import { getStaffList, getStudentsByStaff, type Student } from '@/data/dataManager';
import { studentPerformanceData, studentSemesterProgress } from '@/data/sampleData';
import { useAuth } from '@/data/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

export default function StaffStudentPerformancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      setIsLoading(true);
      try {
        const allStaff = await getStaffList();
        const matched = allStaff.find(s => s.email === user?.email) || allStaff[0];
        if (matched) {
          const staffStudents = await getStudentsByStaff(matched.id);
          setStudents(staffStudents);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformance();
  }, [user]);

  const avgCGPA = students.length > 0 ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2) : '0.00';
  const avgAttendance = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length) : 0;

  if (isLoading) {
    return <div className="flex justify-center py-24"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Student Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">Academic analytics for your {students.length} assigned students</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{students.length}</p>
          <p className="text-xs text-muted-foreground">Assigned Students</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className={`text-2xl font-bold ${Number(avgCGPA) >= 7.5 ? 'text-success' : 'text-destructive'}`}>{avgCGPA}</p>
          <p className="text-xs text-muted-foreground">Average CGPA</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className={`text-2xl font-bold ${avgAttendance >= 80 ? 'text-success' : 'text-destructive'}`}>{avgAttendance}%</p>
          <p className="text-xs text-muted-foreground">Average Attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Subject-wise Average Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="avgScore" name="Average" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highestScore" name="Highest" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lowestScore" name="Lowest" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Semester CGPA Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentSemesterProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="semester" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="avgCGPA" name="Avg CGPA" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual student CGPA comparison */}
      {students.length > 0 && (
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Student CGPA & Attendance</h3>
          <div className="space-y-3">
            {students.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.regNo}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${s.cgpa >= 7.5 ? 'text-success' : 'text-destructive'}`}>{s.cgpa}</p>
                    <p className="text-xs text-muted-foreground">CGPA</p>
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Attend.</span>
                      <span className={`font-medium ${s.attendance >= 80 ? 'text-success' : 'text-destructive'}`}>{s.attendance}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted">
                      <div className={`h-1.5 rounded-full ${s.attendance >= 80 ? 'bg-success' : 'bg-destructive'}`} style={{ width: `${s.attendance}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
