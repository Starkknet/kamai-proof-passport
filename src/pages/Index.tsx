import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileCheck, Coins, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🪷</span>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-foreground">Kamai</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-accent font-medium">Home</a>
              <a href="#features" className="text-foreground hover:text-accent transition-colors">Features</a>
              <a href="#" className="text-foreground hover:text-accent transition-colors">Login</a>
              <Button className="bg-accent hover:bg-accent/90 text-white">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-8 md:p-12 shadow-hover">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Unlock Your Financial Proof
                </h1>
                <p className="text-xl text-accent font-medium">
                  Empowering India's Gig Economy
                </p>
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white text-lg px-8"
                  onClick={() => navigate('/upload')}
                >
                  ₹ Get Started
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl"></div>
                    <div className="relative text-center space-y-4 p-8">
                      <div className="text-8xl">👨‍💼</div>
                      <div className="flex justify-around items-center">
                        <div className="text-3xl">💰</div>
                        <div className="text-4xl">🛵</div>
                        <div className="text-3xl">📦</div>
                      </div>
                      <div className="flex justify-center gap-4">
                        <div className="text-2xl">🏪</div>
                        <div className="text-2xl">💻</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-8 md:p-12 shadow-card">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              How it Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center">
                    <FileCheck className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-accent">Proof</h3>
                <p className="text-muted-foreground">
                  Upload earnings from any gig platform
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center">
                    <Coins className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-accent">Loans</h3>
                <p className="text-muted-foreground">
                  Get verified income certificates
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-accent">Trust</h3>
                <p className="text-muted-foreground">
                  Accepted by banks and lenders
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white">🪷</span>
                </div>
                <p className="text-2xl font-bold text-foreground">Kamai</p>
              </div>
              <p className="text-muted-foreground font-hindi">
                आपकी कमाई, आपका प्रमाण
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
