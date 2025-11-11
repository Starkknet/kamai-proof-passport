import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivacyPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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
              <a href="/dashboard" className="text-foreground hover:text-accent transition-colors">Dashboard</a>
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8 md:p-12 shadow-card">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last Updated: November 2024
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">Data We Collect</h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>CSV files you upload (earnings data)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Email address and name</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Platform names (Swiggy, Zomato, etc.)</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">How We Use Your Data</h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Calculate income and stability scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Generate income certificates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>We never sell your data to third parties</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">Data Security</h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>All data encrypted using Supabase</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Hosted on secure servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>You can delete your account anytime</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">Your Rights</h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Request data deletion</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Download your data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Revoke certificate access</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-foreground">
                <span className="font-semibold">Contact:</span> support@kamai.in
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
