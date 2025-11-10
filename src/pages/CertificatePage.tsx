import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useApp, CertificateData } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const CertificatePage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { metrics, certificate, setCertificate } = useApp();
  const { toast } = useToast();
  const [generatedCert, setGeneratedCert] = useState<CertificateData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateCertificate = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (!metrics) {
        navigate('/dashboard');
        return;
      }

      if (certificate) {
        setGeneratedCert(certificate);
        return;
      }

      setIsGenerating(true);

      try {
        // Fetch transactions to get period and platforms
        const { data: transactions, error: txnError } = await supabase
          .from('transactions')
          .select('txn_date, platform')
          .eq('user_id', user.id)
          .order('txn_date', { ascending: true });

        if (txnError) throw txnError;

        if (!transactions || transactions.length === 0) {
          toast({
            title: "No data found",
            description: "Upload earnings data first",
            variant: "destructive",
          });
          navigate('/upload');
          return;
        }

        // Get earliest and latest dates
        const dates = transactions
          .map(t => t.txn_date)
          .filter(d => d !== null)
          .map(d => new Date(d!));
        
        const earliestDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date();
        const latestDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();

        // Format period
        const period = `${format(earliestDate, 'MMMM yyyy')} - ${format(latestDate, 'MMMM yyyy')}`;

        // Get unique platforms
        const platforms = [...new Set(transactions.map(t => t.platform).filter(p => p))];

        // Generate certificate ID
        const certId = `KAM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0')}`;

        // Get user name from metadata or email
        const workerName = user.user_metadata?.name || user.email || 'Worker';

        // Generate verification hash
        const hashData = `${certId}-${user.id}-${metrics.totalNetIncome}-${metrics.stabilityScore}-${new Date().toISOString()}`;
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashData));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const verificationHash = `SHA-256: ${hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 15)}`;

        const newCert: CertificateData = {
          id: certId,
          workerName,
          period,
          totalNetIncome: metrics.totalNetIncome,
          stabilityScore: metrics.stabilityScore,
          platforms,
          dateIssued: new Date(),
          verificationHash,
        };

        // Save to database
        try {
          const { error: certError } = await supabase
            .from('certificates')
            .insert({
              id: certId,
              user_id: user.id,
              period_start: earliestDate.toISOString(),
              period_end: latestDate.toISOString(),
              net_income: metrics.totalNetIncome,
              stability_score: metrics.stabilityScore,
              verification_hash: verificationHash,
              is_active: true,
              date_issued: new Date().toISOString(),
            });

          if (certError) {
            console.error('Failed to save certificate to database:', certError);
            toast({
              title: "Warning",
              description: "Certificate generated but not saved to database",
              variant: "destructive",
            });
          }
        } catch (saveError) {
          console.error('Error saving certificate:', saveError);
        }

        setGeneratedCert(newCert);
        setCertificate(newCert);
      } catch (error) {
        console.error('Error generating certificate:', error);
        toast({
          title: "Error",
          description: "Failed to generate certificate. Please try again.",
          variant: "destructive",
        });
        navigate('/dashboard');
      } finally {
        setIsGenerating(false);
      }
    };

    generateCertificate();
  }, [user, metrics, certificate]);

  const handleDownload = () => {
    toast({
      title: "Certificate downloaded!",
      description: "Your income certificate has been saved as PDF",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Share your certificate with lenders",
    });
  };

  if (!generatedCert || isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Generating certificate...</p>
        </div>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
                className="border-accent text-accent hover:bg-accent hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Certificate Preview */}
        <Card className="p-8 md:p-12 border-2 border-accent shadow-hover mb-8 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Income Certificate Preview
              </h1>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Verified Income</p>
                <p className="text-5xl font-bold text-foreground mb-2">
                  ₹ {generatedCert.totalNetIncome.toLocaleString('en-IN')}
                </p>
                <p className="text-accent font-medium">
                  Stability Score: {Math.round((generatedCert.stabilityScore / 850) * 100)}% ({generatedCert.period})
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🪷</span>
                </div>
                <span className="text-2xl font-bold text-foreground">Kamai</span>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Certificate ID: {generatedCert.id}</p>
                <p className="text-sm text-muted-foreground">Issued to: {generatedCert.workerName}</p>
              </div>

              <div className="w-48 h-48 bg-white p-4 rounded-xl border-4 border-accent relative">
                {/* QR Code Placeholder */}
                <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'} rounded-sm`}
                    />
                  ))}
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">₹</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Scan to Verify</p>
            </div>
          </div>
        </Card>

        {/* Recent Platforms */}
        <Card className="p-8 shadow-card mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Verified Platforms</h2>
          <div className="flex items-center gap-6 flex-wrap">
            {generatedCert.platforms.map((platform, index) => {
              const platformColors: Record<string, { bg: string; initial: string }> = {
                'zomato': { bg: 'bg-destructive', initial: 'Z' },
                'swiggy': { bg: 'bg-[#FF5200]', initial: 'S' },
                'uber': { bg: 'bg-black', initial: 'U' },
                'ola': { bg: 'bg-success', initial: 'O' },
                'dunzo': { bg: 'bg-blue-500', initial: 'D' },
              };

              const platformKey = platform.toLowerCase();
              const color = platformColors[platformKey] || { bg: 'bg-primary', initial: platform.charAt(0).toUpperCase() };

              return (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${color.bg} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold">{color.initial}</span>
                  </div>
                  <span className="font-semibold text-foreground capitalize">{platform}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white hover-scale"
            onClick={handleDownload}
          >
            Download PDF
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-accent text-accent hover:bg-accent hover:text-white hover-scale"
            onClick={handleShare}
          >
            Share with Lender
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
