import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { GraduationCap, Users, AlertTriangle, UserPlus, Search, Trash2, Link, Loader2 } from 'lucide-react';
import { getStudentList, getStaffList, addStudent, removeStudent, assignStudentToStaff, type Student, type StaffMember } from '@/data/dataManager';

const statusColor: Record<string, string> = {
  active: 'bg-success/10 text-success',
  'at-risk': 'bg-destructive/10 text-destructive',
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignModal, setAssignModal] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add form state
  const [newName, setNewName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newSemester, setNewSemester] = useState(1);
  const [newCgpa, setNewCgpa] = useState<string>('3.0');
  const [newAttendance, setNewAttendance] = useState(85);
  const [newStatus, setNewStatus] = useState<'active' | 'at-risk'>('active');

  const refresh = async () => {
    setIsLoading(true);
    try {
      const [studentData, staffData] = await Promise.all([getStudentList(), getStaffList()]);
      setStudents(studentData);
      setStaff(staffData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalActive = students.filter(s => s.status === 'active').length;
  const totalAtRisk = students.filter(s => s.status === 'at-risk').length;
  const unassigned = students.filter(s => !s.assignedStaffId).length;

  const handleAdd = async () => {
    if (!newName.trim() || !newRegNo.trim()) return;
    const cgpaNum = Number(newCgpa) || 0;
    const calculatedStatus = (cgpaNum < 7 || newAttendance < 80) ? 'at-risk' : 'active';
    await addStudent({ name: newName, regNo: newRegNo, department: newDept, semester: newSemester, cgpa: cgpaNum, attendance: newAttendance, status: calculatedStatus, assignedStaffId: null });
    setNewName(''); setNewRegNo(''); setNewDept('Computer Science'); setNewSemester(1); setNewCgpa('3.0'); setNewAttendance(85);
    setShowAddModal(false);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await removeStudent(id);
    refresh();
  };

  const handleAssign = async (studentId: string, staffId: string | null) => {
    await assignStudentToStaff(studentId, staffId);
    setAssignModal(null);
    refresh();
  };

  const getStaffName = (staffId: string | null) => {
    if (!staffId) return 'Unassigned';
    const s = staff.find(st => st.id === staffId);
    return s ? s.name : 'Unknown';
  };

  const departments = ['Computer Science', 'Business', 'Medicine', 'Arts & Humanities', 'Sciences'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Students Management</h1>
          <p className="text-sm text-muted-foreground mt-1">View, add, and assign students to staff</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={students.length} icon={GraduationCap} color="primary" />
        <StatCard title="Active" value={totalActive} icon={Users} color="success" />
        <StatCard title="At Risk" value={totalAtRisk} icon={AlertTriangle} color="warning" />
        <StatCard title="Unassigned" value={unassigned} icon={Link} color="accent" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or registration no..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'at-risk'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === s ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {s === 'all' ? 'All' : s === 'at-risk' ? 'At Risk' : 'Active'}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="chart-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12 text-muted-foreground"><Loader2 className="animate-spin w-6 h-6" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Reg No</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Department</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Sem</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">CGPA</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Attend.</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Assigned To</th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-foreground">{s.regNo}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{s.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{s.department}</td>
                    <td className="py-3 px-3 text-muted-foreground">{s.semester}</td>
                    <td className="py-3 px-3"><span className={`font-semibold ${s.cgpa >= 7.5 ? 'text-success' : 'text-destructive'}`}>{s.cgpa}</span></td>
                    <td className="py-3 px-3"><span className={`font-semibold ${s.attendance >= 80 ? 'text-success' : 'text-destructive'}`}>{s.attendance}%</span></td>
                    <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span></td>
                    <td className="py-3 px-3">
                      <button onClick={() => setAssignModal(s)} className={`text-xs font-medium px-2 py-1 rounded ${s.assignedStaffId ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-muted text-muted-foreground hover:bg-muted/80'} transition-colors`}>
                        {getStaffName(s.assignedStaffId)}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filtered.length === 0 && <div className="py-12 text-center text-muted-foreground">No students found</div>}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="glass-card p-6 w-full max-w-lg mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Add New Student</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Registration No</label>
                <input value={newRegNo} onChange={e => setNewRegNo(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" placeholder="STU-2024-013" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <select value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Semester</label>
                  <input type="number" min={1} max={8} value={newSemester} onChange={e => setNewSemester(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">CGPA</label>
                  <input type="number" step={0.1} min={0} max={10} value={newCgpa} onChange={e => setNewCgpa(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Attendance %</label>
                  <input type="number" min={0} max={100} value={newAttendance} onChange={e => setNewAttendance(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setAssignModal(null)}>
          <div className="glass-card p-6 w-full max-w-md mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">Assign Student to Staff</h3>
            <p className="text-sm text-muted-foreground mb-4">Student: <span className="font-medium text-foreground">{assignModal.name}</span> ({assignModal.regNo})</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              <button onClick={() => handleAssign(assignModal.id, null)} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${!assignModal.assignedStaffId ? 'bg-primary/10 border border-primary text-primary font-medium' : 'bg-muted/50 text-foreground hover:bg-muted'}`}>
                Unassigned
              </button>
              {staff.filter(s => s.status === 'active').map(s => (
                <button key={s.id} onClick={() => handleAssign(assignModal.id, s.id)} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${assignModal.assignedStaffId === s.id ? 'bg-primary/10 border border-primary text-primary font-medium' : 'bg-muted/50 text-foreground hover:bg-muted'}`}>
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground ml-2">· {s.department} · {s.role}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setAssignModal(null)} className="mt-4 w-full py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
