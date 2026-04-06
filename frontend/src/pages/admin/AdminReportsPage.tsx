import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const reports = [
  { id: 1, title: 'Annual Performance Review 2025', type: 'Performance', date: '2025-12-15', status: 'published', author: 'Admin Office', pages: 42 },
  { id: 2, title: 'Q4 2025 Budget Report', type: 'Financial', date: '2025-12-30', status: 'published', author: 'Finance Dept', pages: 28 },
  { id: 3, title: 'Student Enrollment Analysis', type: 'Analytics', date: '2026-01-10', status: 'published', author: 'Registrar', pages: 35 },
  { id: 4, title: 'Faculty Research Output Summary', type: 'Research', date: '2026-02-01', status: 'published', author: 'Research Office', pages: 22 },
  { id: 5, title: 'Infrastructure Development Plan', type: 'Planning', date: '2026-02-15', status: 'draft', author: 'Facilities', pages: 18 },
  { id: 6, title: 'Accreditation Self-Study Report', type: 'Compliance', date: '2026-03-01', status: 'in-review', author: 'Quality Assurance', pages: 65 },
  { id: 7, title: 'Student Satisfaction Survey Results', type: 'Analytics', date: '2026-02-20', status: 'published', author: 'Student Affairs', pages: 30 },
  { id: 8, title: 'Technology Infrastructure Audit', type: 'IT', date: '2026-01-25', status: 'published', author: 'IT Department', pages: 24 },
];

const statusStyles: Record<string, string> = {
  published: 'bg-success/10 text-success',
  draft: 'bg-muted text-muted-foreground',
  'in-review': 'bg-warning/10 text-warning',
};

const typeColors: Record<string, string> = {
  Performance: 'bg-primary/10 text-primary',
  Financial: 'bg-success/10 text-success',
  Analytics: 'bg-accent/10 text-accent',
  Research: 'bg-info/10 text-info',
  Planning: 'bg-warning/10 text-warning',
  Compliance: 'bg-destructive/10 text-destructive',
  IT: 'bg-muted text-muted-foreground',
};

export default function AdminReportsPage() {
  const [filterType, setFilterType] = useState('all');
  const types = ['all', ...Array.from(new Set(reports.map(r => r.type)))];

  const filtered = filterType === 'all' ? reports : reports.filter(r => r.type === filterType);

  const handleDownload = (report: typeof reports[0]) => {
    const content = `Report Title: ${report.title}\nReport Type: ${report.type}\nAuthor: ${report.author}\nDate: ${report.date}\nStatus: ${report.status}\nPages: ${report.pages}\n\n[End of Report]`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Access and manage institutional reports</p>
      </div>

      {/* Summary cards */}
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
            <div className="p-3 rounded-xl bg-success/10 text-success"><Download className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{reports.filter(r => r.status === 'published').length}</p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10 text-warning"><Calendar className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">{reports.filter(r => r.status === 'in-review' || r.status === 'draft').length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {t === 'all' ? 'All Types' : t}
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {filtered.map((report, i) => (
          <div key={report.id} className="stat-card flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{report.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[report.status]}`}>{report.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className={`px-2 py-0.5 rounded-full ${typeColors[report.type] || 'bg-muted text-muted-foreground'}`}>{report.type}</span>
                <span>{report.author}</span>
                <span>{report.date}</span>
                <span>{report.pages} pages</span>
              </div>
            </div>
            <button 
              onClick={() => handleDownload(report)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors self-start"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
