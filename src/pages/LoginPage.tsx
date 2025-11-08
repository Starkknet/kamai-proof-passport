import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileCheck, Coins, Shield, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/upload');
    return null;
  }

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/upload`,
          },
        });

        if (error) throw error;
        
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Welcome back!");
        navigate('/upload');
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/upload`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    }
  };

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
                <h2 className="text-3xl font-bold text-primary">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-14 pr-10 border-accent/50 focus:border-accent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  </div>
                  
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-14 pr-10 border-accent/50 focus:border-accent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-14 bg-accent hover:bg-accent/90 text-white text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      isSignUp ? "Sign Up" : "Login"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 border-accent/50 hover:bg-accent/5"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>

                  <p className="text-center text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-accent font-medium hover:underline"
                    >
                      {isSignUp ? "Login" : "Sign Up"}
                    </button>
                  </p>
                </form>
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
