import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Mail, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ContactPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
            Contact Us
          </h1>

          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-background rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">Email</h3>
                <a 
                  href="mailto:support@kamai.in" 
                  className="text-foreground hover:text-accent transition-colors text-lg"
                >
                  support@kamai.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-background rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">Support Hours</h3>
                <p className="text-foreground text-lg">Monday-Friday, 9 AM - 6 PM IST</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-foreground text-center">
                For urgent issues, please email us directly.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
