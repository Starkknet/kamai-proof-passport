import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, FileText, FileCheck, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, IncomeMetrics } from "@/contexts/AppContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { uploadedFiles, setMetrics } = useApp();
  const [calculatedMetrics, setCalculatedMetrics] = useState<IncomeMetrics | null>(null);

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      navigate('/upload');
      return;
    }

    // Calculate metrics from uploaded files
    const calculateMetrics = () => {
      const totalGross = uploadedFiles.reduce((sum, file) => sum + file.rowsDetected * 350, 0);
      const totalNet = totalGross * 0.85;
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = months.map((month, idx) => ({
        month,
        income: (totalNet / 12) * (0.8 + Math.random() * 0.4),
      }));

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
        totalNetIncome: 250000,
        stabilityScore: 720,
        activeWeeks: 23,
        totalWeeks: 26,
        platformBreakdown,
        monthlyData,
        trend: 15,
      };

      setCalculatedMetrics(metrics);
      setMetrics(metrics);
    };

    calculateMetrics();
  }, [uploadedFiles]);

  if (!calculatedMetrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🪷</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Kamai</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="/dashboard" className="text-accent font-medium border-b-2 border-accent pb-1">Dashboard</a>
              <a href="#" className="text-foreground hover:text-accent transition-colors">History</a>
              <a href="#" className="text-foreground hover:text-accent transition-colors">Settings</a>
              <Button className="bg-accent hover:bg-accent/90 text-white">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Metric Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <Card className="p-6 border-2 border-accent shadow-card animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Verified Income</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">₹ 2,50,000</p>
                  <p className="text-sm text-accent">+15% from last month</p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">720/850</p>
                  <TrendingUp className="h-4 w-4 text-success mx-auto" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-accent shadow-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Verified Income</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">₹ 2,50,000</p>
                  <p className="text-sm text-accent">+15% from last month</p>
                </div>
                <div className="text-center">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">3 Certificates</p>
                  <p className="text-xs text-muted-foreground">Expiring soon: 1</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 shadow-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-foreground mb-4">Income Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={calculatedMetrics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Transactions & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Platform_march 2024.csv</p>
                  <p className="text-sm text-muted-foreground">10.13.40 48 vepled</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">earnings_march 2024.csv</p>
                  <p className="text-sm text-muted-foreground">1.M 2.008 Plepled</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">₹</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Certificate Download</p>
                  <p className="text-sm text-muted-foreground">CSV Upload Dec 10</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Certificate Download</p>
                  <p className="text-sm text-muted-foreground">Dec 10</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/upload')}
                className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:scale-105 transition-transform"
              >
                <FileText className="h-8 w-8 text-white" />
                <span className="text-xs text-white text-center">Upload New Data</span>
              </button>
              <button 
                onClick={() => navigate('/certificate')}
                className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:scale-105 transition-transform"
              >
                <FileCheck className="h-8 w-8 text-white" />
                <span className="text-xs text-white text-center">Generate Certificate</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:scale-105 transition-transform">
                <Shield className="h-8 w-8 text-white" />
                <span className="text-xs text-white text-center">View Lenders</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
