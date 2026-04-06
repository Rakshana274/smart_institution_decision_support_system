import { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import { Users, UserCheck, UserX, Search, Mail, Phone, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { getStaffList, getStudentList, addStaff, removeStaff, updateStaff, type StaffMember } from '@/data/dataManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusStyles: Record<string, string> = {
  active: 'bg-success/10 text-success',
  'on-leave': 'bg-warning/10 text-warning',
  inactive: 'bg-muted text-muted-foreground',
};

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newRole, setNewRole] = useState('Lecturer');

  const refresh = async () => {
    setIsLoading(true);
    try {
      const [staff, students] = await Promise.all([getStaffList(), getStudentList()]);
      setStaffList(staff);
      
      const counts: Record<string, number> = {};
      students.forEach(s => {
        if (s.assignedStaffId) {
          counts[s.assignedStaffId] = (counts[s.assignedStaffId] || 0) + 1;
        }
      });
      setStudentCounts(counts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = staffList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const active = staffList.filter(s => s.status === 'active').length;
  const onLeave = staffList.filter(s => s.status === 'on-leave').length;
  const inactive = staffList.filter(s => s.status === 'inactive').length;

  const handleAdd = async () => {
    if (!newName.trim() || !newEmail.trim()) return;
    await addStaff({ name: newName, email: newEmail, phone: newPhone, department: newDept, role: newRole, status: 'active', joinDate: new Date().toISOString().split('T')[0], rating: 0 });
    setNewName(''); setNewEmail(''); setNewPhone(''); setNewDept('Computer Science'); setNewRole('Lecturer');
    setShowAddModal(false);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await removeStaff(id);
    refresh();
  };

  const handleUpdate = async (id: string, field: string, value: string | number) => {
    await updateStaff(id, { [field]: value });
    refresh();
  };

  const departments = ['Computer Science', 'Business', 'Medicine', 'Arts & Humanities', 'Sciences'];
  const roles = ['Professor', 'Associate Professor', 'Assistant Professor', 'Senior Lecturer', 'Lecturer'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">View, add, and manage staff members</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Staff" value={staffList.length} icon={Users} color="primary" />
        <StatCard title="Active" value={active} icon={UserCheck} color="success" />
        <StatCard title="On Leave" value={onLeave} icon={Users} color="warning" />
        <StatCard title="Inactive" value={inactive} icon={UserX} color="accent" />
      </div>      <div className="chart-card mb-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Staff Performance Comparison</h3>
        {staffList.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
            No staff data available for comparison. Add staff to see performance metrics.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={staffList}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="rating" name="Rating (out of 5)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or department..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'on-leave', 'inactive'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-12 text-muted-foreground"><Loader2 className="animate-spin w-6 h-6" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Department</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Students</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Rating</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{s.department}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.role}</td>
                    <td className="py-3 px-4">
                      <select 
                        value={s.status || ''} 
                        onChange={e => handleUpdate(s.id, 'status', e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer border-none outline-none appearance-none ${statusStyles[s.status] || 'bg-muted text-muted-foreground'}`}
                      >
                        <option value=""></option>
                        <option value="active" className="text-success bg-background">Active</option>
                        <option value="inactive" className="text-muted-foreground bg-background">Inactive</option>
                        <option value="on-leave" className="text-warning bg-background">On Leave</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right"><span className="text-foreground font-medium">{studentCounts[s.id] || 0}</span></td>
                    <td className="py-3 px-4 text-right">
                      <select 
                        value={s.rating} 
                        onChange={e => handleUpdate(s.id, 'rating', Number(e.target.value))}
                        className="text-foreground font-medium bg-transparent border-none outline-none cursor-pointer appearance-none text-right"
                      >
                        {[0, 1, 2, 3, 4, 5].map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <span className="text-muted-foreground">/5</span>
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedStaff(s)} className="text-xs font-medium text-primary hover:underline">View</button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filtered.length === 0 && <div className="py-12 text-center text-muted-foreground">No staff members found</div>}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedStaff(null)}>
          <div className="glass-card p-6 w-full max-w-md mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{selectedStaff.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStaff.role}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[selectedStaff.status]}`}>{selectedStaff.status}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /><span className="text-foreground">{selectedStaff.email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /><span className="text-foreground">{selectedStaff.phone}</span></div>
              <div className="flex items-center gap-3 text-sm"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-foreground">{selectedStaff.department}</span></div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-display font-bold text-foreground">{selectedStaff.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-display font-bold text-foreground">{new Date(selectedStaff.joinDate).getFullYear()}</p>
                <p className="text-xs text-muted-foreground">Joined</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-display font-bold text-foreground">{studentCounts[selectedStaff.id] || 0}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
            <button onClick={() => setSelectedStaff(null)} className="mt-6 w-full py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="glass-card p-6 w-full max-w-lg mx-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Add New Staff</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" placeholder="Dr. Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" placeholder="name@institution.edu" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <input value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" placeholder="+1 555-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Department</label>
                  <select value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Role</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="flex-1 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
