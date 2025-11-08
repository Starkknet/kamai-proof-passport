import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileCheck, Coins, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

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
              <a href="/" className="text-accent font-medium hover:underline">Home</a>
              <a href="/#features" className="text-primary font-medium hover:text-accent transition-colors">Features</a>
              <a href="/login" className="text-primary font-medium hover:text-accent transition-colors">Login</a>
              <Button className="bg-accent hover:bg-accent/90 text-white" onClick={() => navigate('/login')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl">
          <Card className="p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Illustration */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                  Join Kamai, Unlock Your Financial Future
                </h1>
                <div className="flex justify-center">
                  <div className="text-8xl">🛵</div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="Email Address"
                      className="h-14 pr-10 border-accent/50 focus:border-accent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  </div>
                  
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="Password"
                      className="h-14 pr-10 border-accent/50 focus:border-accent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  </div>

                  <Button 
                    className="w-full h-14 bg-accent hover:bg-accent/90 text-white text-lg"
                    onClick={() => navigate('/upload')}
                  >
                    Login
                  </Button>

                  <p className="text-center text-muted-foreground">
                    Forgot o Kamai? <a href="/login" className="text-accent font-medium hover:underline">Sign Up</a>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center">
                  <FileCheck className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-accent">Proof</h3>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center">
                  <Coins className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-accent">Loans</h3>
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-accent">Trust</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
