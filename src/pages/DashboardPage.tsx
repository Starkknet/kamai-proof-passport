import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, FileText, FileCheck, Download, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, IncomeMetrics } from "@/contexts/AppContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { fetchTransactions, setMetrics } = useApp();
  const [calculatedMetrics, setCalculatedMetrics] = useState<IncomeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);

      try {
        // Fetch transactions from database
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('txn_date', { ascending: true });

        if (error) throw error;

        if (!transactions || transactions.length === 0) {
          navigate('/upload');
          return;
        }

        // Calculate metrics from real transaction data
        const totalIncome = transactions.reduce((sum, txn) => sum + (txn.amount_numeric || 0), 0);
        const totalNet = totalIncome * 0.85; // 15% deduction

        // Group by month
        const monthlyMap: Record<string, number> = {};
        transactions.forEach(txn => {
          if (txn.txn_date) {
            const date = new Date(txn.txn_date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + (txn.amount_numeric || 0);
          }
        });

        const monthlyData = Object.entries(monthlyMap).map(([month, income]) => ({
          month,
          income: income * 0.85,
        }));

        // Group by platform
        const platformMap: Record<string, number> = {};
        transactions.forEach(txn => {
          platformMap[txn.platform] = (platformMap[txn.platform] || 0) + (txn.amount_numeric || 0);
        });

        const totalPlatformIncome = Object.values(platformMap).reduce((a, b) => a + b, 0);
        const platformBreakdown = Object.entries(platformMap).map(([platform, amount]) => ({
          platform,
          amount: amount * 0.85,
          percentage: (amount / totalPlatformIncome) * 100,
        }));

        // Calculate stability metrics
        const uniqueDates = new Set(
          transactions
            .filter(txn => txn.txn_date)
            .map(txn => new Date(txn.txn_date!).toISOString().split('T')[0])
        );
        const activeWeeks = Math.floor(uniqueDates.size / 7);
        const totalWeeks = 26; // Assuming 6 months
        const stabilityScore = Math.min(850, Math.floor((activeWeeks / totalWeeks) * 850));

        const metrics: IncomeMetrics = {
          totalNetIncome: totalNet,
          stabilityScore,
          activeWeeks,
          totalWeeks,
          platformBreakdown,
          monthlyData,
          trend: 15,
        };

        setCalculatedMetrics(metrics);
        setMetrics(metrics);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (isLoading || !calculatedMetrics) {
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🪷</span>
              </div>
              <span className="text-2xl font-bold text-accent">Kamai</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-accent font-medium border-b-2 border-accent pb-1">Dashboard</a>
              <a href="/history" className="text-foreground hover:text-accent transition-colors">History</a>
              <a href="/settings" className="text-foreground hover:text-accent transition-colors">Settings</a>
              {user?.email === 'demo@kamai.in' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Demo
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      {user?.email === 'demo@kamai.in' && (
        <div className="bg-accent/10 border-b border-accent/20">
          <div className="container mx-auto px-4 py-3">
            <Alert className="border-0 bg-transparent">
              <Info className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm text-foreground">
                📺 <strong>Demo Mode</strong> - This is sample data. <a href="/login" className="underline font-medium text-accent hover:text-accent/80">Sign up</a> to upload your own earnings!
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Metric Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <Card className="p-6 border-2 border-accent shadow-card animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Verified Income</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    ₹ {calculatedMetrics.totalNetIncome.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-accent">+{calculatedMetrics.trend}% from last month</p>
                </div>
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{calculatedMetrics.stabilityScore}/850</p>
                  <TrendingUp className="h-4 w-4 text-success mx-auto" />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-2 border-accent shadow-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Work Activity</h3>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {calculatedMetrics.activeWeeks}/{calculatedMetrics.totalWeeks} weeks
                  </p>
                  <p className="text-sm text-accent">Active work periods</p>
                </div>
                <div className="text-center">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{calculatedMetrics.platformBreakdown.length} Platforms</p>
                  <p className="text-xs text-muted-foreground">{calculatedMetrics.platformBreakdown.map(p => p.platform).join(', ')}</p>
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
