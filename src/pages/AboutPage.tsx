import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AboutPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            About KAMAI
          </h1>
          
          <p className="text-lg text-foreground mb-12">
            KAMAI empowers India's 50+ million gig economy workers to access financial services by providing verified income certificates.
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">The Problem</h2>
              <p className="text-foreground leading-relaxed">
                Gig workers earn through platforms like Swiggy, Zomato, and Uber, but lack formal income proof needed for loans, credit cards, and renting apartments.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">Our Solution</h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Upload earnings data from any gig platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>We calculate verified net income and stability scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Generate cryptographically secure certificates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">•</span>
                  <span>Share with banks, landlords, and lenders</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">Why KAMAI?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-accent text-2xl">✓</span>
                  <span className="text-foreground">100% Free for workers</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent text-2xl">✓</span>
                  <span className="text-foreground">Bank-grade security</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent text-2xl">✓</span>
                  <span className="text-foreground">Works with any gig platform</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent text-2xl">✓</span>
                  <span className="text-foreground">Instant certificate generation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white text-lg px-8"
              onClick={() => navigate('/login')}
            >
              ₹ Get Started
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
