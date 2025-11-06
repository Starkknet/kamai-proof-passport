import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Lock, CheckCircle, Upload, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10 -z-10" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl md:text-5xl font-bold text-foreground">Kamai</span>
              <span className="text-4xl md:text-5xl text-accent">₹</span>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                Your Work, Your Proof
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-hindi">
                अपनी आमदनी का सबूत
              </p>
            </div>

            {/* Hero Illustration */}
            <div className="flex justify-center py-8">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <TrendingUp className="w-24 h-24 mx-auto text-primary" strokeWidth={1.5} />
                    <div className="text-6xl">🛵</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/upload')}
                className="text-lg px-8 py-6 shadow-hover hover:scale-105 transition-transform"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Earnings
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="text-lg px-8 py-6"
              >
                How It Works
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Bank-grade security • Auto-deleted after 30 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kamai Section */}
      <section id="how-it-works" className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Kamai?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4 shadow-card hover:shadow-hover transition-shadow">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Simple</h3>
              <p className="text-muted-foreground">
                Upload CSVs from any gig platform - Swiggy, Zomato, Uber, Rapido, and more
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 shadow-card hover:shadow-hover transition-shadow">
              <div className="flex justify-center">
                <div className="p-4 bg-accent/10 rounded-full">
                  <Lock className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Private</h3>
              <p className="text-muted-foreground">
                Your data stays with you, automatically deleted after 30 days
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 shadow-card hover:shadow-hover transition-shadow">
              <div className="flex justify-center">
                <div className="p-4 bg-success/10 rounded-full">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Trusted</h3>
              <p className="text-muted-foreground">
                QR-verified certificates accepted by lenders and institutions
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-foreground mb-2">Kamai ₹</p>
              <p className="text-lg text-muted-foreground font-hindi">
                आपकी कमाई, आपका प्रमाण
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Powered by Kamai</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
