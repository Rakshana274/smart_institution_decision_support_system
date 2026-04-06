import { useState, useEffect } from 'react';
import { getStaffList, getStudentsByStaff, type Student } from '@/data/dataManager';
import { studentPerformanceData } from '@/data/sampleData';
import { useAuth } from '@/data/store';
import { FileText, ChevronDown, ChevronUp, Users, Loader2, Download } from 'lucide-react';

export default function StaffStudentRecordsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
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
    fetchRecords();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Student Records</h1>
        <p className="text-sm text-muted-foreground mt-1">Detailed academic records for your assigned students</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
      ) : students.length === 0 ? (
        <div className="chart-card text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No students assigned</p>
          <p className="text-sm text-muted-foreground mt-1">Records will appear here once students are assigned to you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map(student => {
            const isExpanded = expandedId === student.id;
            const grades = studentPerformanceData.map((sub, i) => {
              const score = Math.min(100, Math.max(30, Math.round(sub.avgScore + (student.cgpa - 8.25) * 4 + (i % 3 === 0 ? 5 : -3))));
              const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F';
              return { subject: sub.subject, score, grade };
            });

            return (
              <div key={student.id} className="chart-card">
                <div className="w-full flex items-center justify-between">
                  <button onClick={() => setExpandedId(isExpanded ? null : student.id)} className="flex-1 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10"><FileText className="w-5 h-5 text-primary" /></div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.regNo} · Semester {student.semester}</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-foreground">CGPA: {student.cgpa}</p>
                        <p className="text-xs text-muted-foreground">Attendance: {student.attendance}%</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const content = `Student Name: ${student.name}
Registration No: ${student.regNo}
Department: ${student.department}
Semester: ${student.semester}
CGPA: ${student.cgpa}
Attendance: ${student.attendance}%
Status: ${student.status}

SUBJECT GRADES:
${grades.map(g => `- ${g.subject}: ${g.score} (${g.grade})`).join('\n')}
`;
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${student.name.replace(/\s+/g, '_')}_Report.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2 ml-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-medium text-foreground">{student.department}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Semester</p>
                        <p className="text-sm font-medium text-foreground">{student.semester}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">CGPA</p>
                        <p className={`text-sm font-semibold ${student.cgpa >= 7.5 ? 'text-success' : 'text-destructive'}`}>{student.cgpa}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className={`text-sm font-semibold ${student.status === 'active' ? 'text-success' : 'text-destructive'}`}>{student.status}</p>
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-foreground mb-2">Subject Grades</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Subject</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Score</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map(g => (
                            <tr key={g.subject} className="border-b border-border/50">
                              <td className="py-2 px-3 text-foreground">{g.subject}</td>
                              <td className="py-2 px-3"><span className={`font-semibold ${g.score >= 70 ? 'text-success' : g.score >= 50 ? 'text-warning' : 'text-destructive'}`}>{g.score}</span></td>
                              <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${g.score >= 70 ? 'bg-success/10 text-success' : g.score >= 50 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>{g.grade}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
