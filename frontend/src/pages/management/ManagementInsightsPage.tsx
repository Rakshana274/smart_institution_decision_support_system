import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { decisionInsights } from '@/data/sampleData';

export default function ManagementInsightsPage() {
  const trendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-5 h-5 text-success" />;
    if (trend === 'down') return <ArrowDownRight className="w-5 h-5 text-destructive" />;
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Strategic Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Data-driven recommendations for institution growth</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decisionInsights.map((insight, i) => (
          <div key={i} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-muted rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${insight.change >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {trendIcon(insight.trend)}
                {insight.change > 0 ? '+' : ''}{insight.change}%
              </div>
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">{insight.area}</h3>
            <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
