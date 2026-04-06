import { useState } from 'react';
import { FileText, Send, CheckCircle, Clock } from 'lucide-react';

const existingReports = [
  { id: 1, title: 'Weekly Activity Report - Week 8', date: '2026-02-27', status: 'submitted', feedback: 'Well documented. Keep it up!' },
  { id: 2, title: 'Research Progress Update', date: '2026-02-20', status: 'reviewed', feedback: 'Needs more detail on methodology' },
  { id: 3, title: 'Weekly Activity Report - Week 7', date: '2026-02-20', status: 'submitted', feedback: null },
  { id: 4, title: 'Lab Equipment Request', date: '2026-02-15', status: 'approved', feedback: 'Approved for Q2 budget' },
  { id: 5, title: 'Student Performance Summary', date: '2026-02-10', status: 'reviewed', feedback: 'Good analysis. Share with department.' },
];

const statusStyles: Record<string, string> = {
  submitted: 'bg-primary/10 text-primary',
  reviewed: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
};

export default function StaffReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState({ title: '', type: 'weekly', content: '' });
  const [reports, setReports] = useState(existingReports);

  const submitReport = () => {
    if (!report.title.trim() || !report.content.trim()) return;
    setReports([{ id: Date.now(), title: report.title, date: new Date().toISOString().split('T')[0], status: 'submitted', feedback: null }, ...reports]);
    setReport({ title: '', type: 'weekly', content: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit and track your reports</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <FileText className="w-4 h-4" /> New Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary"><FileText className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{reports.length}</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-success"><CheckCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{reports.filter(r => r.status === 'approved' || r.status === 'reviewed').length}</p>
              <p className="text-xs text-muted-foreground">Reviewed</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10 text-warning"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{reports.filter(r => r.status === 'submitted').length}</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit form */}
      {showForm && (
        <div className="chart-card mb-6 animate-fade-in">
          <h3 className="font-display font-semibold text-foreground mb-4">Submit New Report</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={report.title} onChange={e => setReport({ ...report, title: e.target.value })} placeholder="Report title" className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={report.type} onChange={e => setReport({ ...report, type: e.target.value })} className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="weekly">Weekly Activity</option>
                <option value="research">Research Progress</option>
                <option value="request">Request</option>
                <option value="performance">Performance Summary</option>
              </select>
            </div>
            <textarea value={report.content} onChange={e => setReport({ ...report, content: e.target.value })} placeholder="Report content..." rows={5} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            <div className="flex justify-end">
              <button onClick={submitReport} className="flex items-center gap-2 gradient-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" /> Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-3">
        {reports.map((r, i) => (
          <div key={r.id} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-foreground">{r.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[r.status]}`}>{r.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
                {r.feedback && (
                  <div className="mt-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                    💬 {r.feedback}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
