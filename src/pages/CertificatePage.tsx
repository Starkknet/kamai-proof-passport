import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useApp, CertificateData } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CertificatePage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { metrics, certificate, setCertificate, uploadedFiles } = useApp();
  const { toast } = useToast();
  const [generatedCert, setGeneratedCert] = useState<CertificateData | null>(null);

  useEffect(() => {
    if (!metrics) {
      navigate('/dashboard');
      return;
    }

    if (certificate) {
      setGeneratedCert(certificate);
    } else {
      const certId = `KAM-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
      const platforms = [...new Set(uploadedFiles.map(f => f.platform))];
      
      const newCert: CertificateData = {
        id: certId,
        workerName: "Rajash Kumar",
        period: "March 2024",
        totalNetIncome: 250000,
        stabilityScore: 82,
        platforms: platforms.length > 0 ? platforms : ['Zomato', 'Swiggy'],
        dateIssued: new Date(),
        verificationHash: `SHA-256: ${Math.random().toString(36).substring(2, 15)}`,
      };

      setGeneratedCert(newCert);
      setCertificate(newCert);
    }
  }, [metrics, certificate]);

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

  if (!generatedCert) {
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
                <p className="text-5xl font-bold text-foreground mb-2">₹ 2,50,000</p>
                <p className="text-accent font-medium">+15% Verified Income (March 2024)</p>
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
                <p className="text-sm text-muted-foreground">Certificate ID: #KM024-03-A7B9</p>
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Platforms</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">₹</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Platform_march 2024.csv</p>
                <p className="text-sm text-muted-foreground">20.13.40 48 vepled</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <span className="font-semibold text-foreground">Zomato</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF5200] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-semibold text-foreground">Swiggy</span>
            </div>
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
