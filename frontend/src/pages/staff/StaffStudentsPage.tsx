import { useState, useEffect } from 'react';
import { getStaffList, getStudentsByStaff, type Student } from '@/data/dataManager';
import { useAuth } from '@/data/store';
import { Search, Users, AlertTriangle, GraduationCap, Loader2 } from 'lucide-react';

const statusColor: Record<string, string> = {
  active: 'bg-success/10 text-success',
  'at-risk': 'bg-destructive/10 text-destructive',
};

export default function StaffStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const allStaff = await getStaffList();
        const matchedStaff = allStaff.find(s => s.email === user?.email);
        
        if (matchedStaff) {
          const staffStudents = await getStudentsByStaff(matchedStaff.id);
          setStudents(staffStudents);
        } else {
          // Fallback
          const firstStaff = allStaff[0];
          if (firstStaff) {
            const staffStudents = await getStudentsByStaff(firstStaff.id);
            setStudents(staffStudents);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const totalActive = students.filter(s => s.status === 'active').length;
  const totalAtRisk = students.filter(s => s.status === 'at-risk').length;
  const avgCGPA = students.length > 0 ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2) : '0.00';

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">My Students</h1>
        <p className="text-sm text-muted-foreground mt-1">Students assigned to you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Users className="w-5 h-5 text-primary" /></div>
          <div><p className="text-xs text-muted-foreground">Total Students</p><p className="text-xl font-bold text-foreground">{students.length}</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10"><GraduationCap className="w-5 h-5 text-success" /></div>
          <div><p className="text-xs text-muted-foreground">Active</p><p className="text-xl font-bold text-foreground">{totalActive}</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
          <div><p className="text-xs text-muted-foreground">At Risk</p><p className="text-xl font-bold text-foreground">{totalAtRisk}</p></div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10"><GraduationCap className="w-5 h-5 text-accent" /></div>
          <div><p className="text-xs text-muted-foreground">Avg CGPA</p><p className="text-xl font-bold text-foreground">{avgCGPA}</p></div>
        </div>
      </div>

      {isLoading ? (
        <div className="chart-card flex justify-center py-12 text-muted-foreground"><Loader2 className="animate-spin w-8 h-8" /></div>
      ) : students.length === 0 ? (
        <div className="chart-card text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No students assigned yet</p>
          <p className="text-sm text-muted-foreground mt-1">Contact your admin to get students assigned to you</p>
        </div>
      ) : (
        <div className="chart-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display font-semibold text-foreground">Student Directory</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="at-risk">At Risk</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Reg No</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Department</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Semester</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">CGPA</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Attendance</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 text-foreground font-mono text-xs">{s.regNo}</td>
                    <td className="py-3 px-3 text-foreground font-medium">{s.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{s.department}</td>
                    <td className="py-3 px-3 text-muted-foreground">{s.semester}</td>
                    <td className="py-3 px-3"><span className={`font-semibold ${s.cgpa >= 7.5 ? 'text-success' : 'text-destructive'}`}>{s.cgpa}</span></td>
                    <td className="py-3 px-3"><span className={`font-semibold ${s.attendance >= 80 ? 'text-success' : 'text-destructive'}`}>{s.attendance}%</span></td>
                    <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
