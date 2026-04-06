import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from 'recharts';
import { budgetDistribution, quarterlyRevenue } from '@/data/sampleData';
import { DollarSign, TrendingUp } from 'lucide-react';

const COLORS = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

export default function ManagementBudgetPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Budget & Financials</h1>
        <p className="text-sm text-muted-foreground mt-1">Track resource allocation and revenue streams</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary"/> Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={budgetDistribution} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {budgetDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val: number, name: string, props: any) => [`$${(props.payload.amount / 1e6).toFixed(1)}M (${val}%)`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/> Quarterly Performance</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={quarterlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `$${(v/1e6)}M`} />
              <Tooltip formatter={(v: number) => `$${(v/1e6).toFixed(2)}M`} contentStyle={{ borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" radius={[4,4,0,0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
