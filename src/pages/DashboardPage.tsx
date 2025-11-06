import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Activity, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, IncomeMetrics } from "@/contexts/AppContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { uploadedFiles, setMetrics, timePeriod, setTimePeriod } = useApp();
  const [calculatedMetrics, setCalculatedMetrics] = useState<IncomeMetrics | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      navigate('/upload');
      return;
    }

    // Calculate metrics from uploaded files
    const calculateMetrics = () => {
      // Mock calculation - in real app, parse the CSV data
      const totalGross = uploadedFiles.reduce((sum, file) => sum + file.rowsDetected * 350, 0);
      const totalNet = totalGross * 0.85; // 15% deduction for fuel/fees
      
      // Generate monthly data
      const months = ['Oct', 'Nov', 'Dec'];
      const monthlyData = months.map((month, idx) => ({
        month,
        income: totalNet / 3 + (Math.random() - 0.5) * 5000,
      }));

      // Platform breakdown
      const platformCounts: Record<string, number> = {};
      uploadedFiles.forEach(file => {
        platformCounts[file.platform] = (platformCounts[file.platform] || 0) + file.rowsDetected;
      });

      const totalRows = Object.values(platformCounts).reduce((a, b) => a + b, 0);
      const platformBreakdown = Object.entries(platformCounts).map(([platform, count]) => ({
        platform,
        amount: (count / totalRows) * totalNet,
        percentage: (count / totalRows) * 100,
      }));

      const metrics: IncomeMetrics = {
        totalNetIncome: totalNet,
        stabilityScore: 82,
        activeWeeks: 23,
        totalWeeks: 26,
        platformBreakdown,
        monthlyData,
        trend: 12,
      };

      setCalculatedMetrics(metrics);
      setMetrics(metrics);
    };

    calculateMetrics();
  }, [uploadedFiles, timePeriod]);

  if (!calculatedMetrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const platformColors: Record<string, string> = {
    'Swiggy': '#FF5200',
    'Zomato': '#E23744',
    'Uber': '#000000',
    'Rapido': '#FFC700',
    'UrbanClap': '#2C7BE5',
    'Unknown Platform': '#6B7280',
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === 'en' ? 'Your Kamai Overview' : 'आपकी कमाई का विवरण'}
            </h1>
            <p className="text-muted-foreground mt-2">Track your earnings and stability</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
              <Button
                variant={language === 'hi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('hi')}
                className="font-hindi"
              >
                हिं
              </Button>
            </div>

            <select
              className="px-4 py-2 rounded-lg border bg-card text-foreground"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as '3' | '6' | '12')}
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 1 year</option>
            </select>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 shadow-card hover:shadow-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                +{calculatedMetrics.trend}%
              </Badge>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">
              {language === 'en' ? 'Total Net Income' : 'कुल शुद्ध आय'}
            </h3>
            <p className="text-3xl font-bold text-foreground mb-1">
              ₹{calculatedMetrics.totalNetIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-muted-foreground">After fuel & fees</p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Activity className="h-6 w-6 text-accent" />
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">
              {language === 'en' ? 'Stability Score' : 'स्थिरता स्कोर'}
            </h3>
            <p className="text-3xl font-bold text-foreground mb-2">
              {calculatedMetrics.stabilityScore}/100
            </p>
            <Progress value={calculatedMetrics.stabilityScore} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">Excellent consistency</p>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="h-6 w-6 text-success" />
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">
              {language === 'en' ? 'Active Weeks' : 'सक्रिय सप्ताह'}
            </h3>
            <p className="text-3xl font-bold text-foreground mb-1">
              {calculatedMetrics.activeWeeks}/{calculatedMetrics.totalWeeks}
            </p>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </Card>
        </div>

        {/* Income Trend Chart */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Income Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={calculatedMetrics.monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(243, 80%, 62%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(243, 80%, 62%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="hsl(243, 80%, 62%)"
                strokeWidth={3}
                fill="url(#incomeGradient)"
                dot={{ fill: 'hsl(243, 80%, 62%)', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Breakdown */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Platform Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={calculatedMetrics.platformBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="amount"
                  label={(entry) => `${entry.percentage.toFixed(0)}%`}
                >
                  {calculatedMetrics.platformBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={platformColors[entry.platform]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              {calculatedMetrics.platformBreakdown.map((item) => (
                <div key={item.platform} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: platformColors[item.platform] }}
                    />
                    <span className="font-medium text-foreground">{item.platform}</span>
                  </div>
                  <span className="font-bold text-foreground">
                    ₹{item.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={() => navigate('/certificate')}
            className="px-8 shadow-hover hover:scale-105 transition-transform"
          >
            <FileText className="mr-2 h-5 w-5" />
            Generate Income Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
