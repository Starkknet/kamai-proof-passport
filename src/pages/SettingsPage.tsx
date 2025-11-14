import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState("security");
  const isDemoUser = user?.email === 'demo@kamai.in';

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
              <a href="/" className="text-primary font-medium hover:text-accent transition-colors">Dashboard</a>
              <a href="/history" className="text-primary font-medium hover:text-accent transition-colors">History</a>
              <a href="/settings" className="text-accent font-medium border-b-2 border-accent pb-1">Settings</a>
              {isDemoUser ? (
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Profile Settings */}
        <Card className="p-8 md:p-12 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary">Profile Settings</h1>
            <Camera className="w-10 h-10 text-muted-foreground cursor-pointer hover:text-accent transition-colors" />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
              <button 
                className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                onClick={() => setActiveTab("personal")}
              >
                Personal Information
              </button>
              <button 
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "security" 
                    ? "bg-accent/10 text-accent border-l-4 border-accent font-semibold" 
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
              <button 
                className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                onClick={() => setActiveTab("notifications")}
              >
                Notifications
              </button>
              <button 
                className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                onClick={() => setActiveTab("connected")}
              >
                Connected Accounts
              </button>
            </div>

            {/* Form Content */}
            <div className="md:col-span-3 space-y-6">
              {isDemoUser && (
                <Alert className="border-accent/20 bg-accent/10">
                  <Info className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-sm text-foreground">
                    Demo users cannot modify settings. <a href="/login" className="underline font-medium text-accent">Sign up</a> to customize your account.
                  </AlertDescription>
                </Alert>
              )}
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                <div className="relative">
                  <Input className="h-12 pr-10" placeholder="Full Name" disabled={isDemoUser} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                <div className="relative">
                  <Input className="h-12 pr-10" value="rajesh-kumar@email.com" readOnly />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 border rounded-lg bg-muted">🇮🇳</span>
                    <Input className="h-12 pr-10 flex-1" value="+91 98765 4310" readOnly />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-accent hover:bg-accent/90 text-white px-8"
                  disabled={isDemoUser}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Delete Account Section */}
        <Card className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Delete Account</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">Z</div>
              <span className="font-semibold text-foreground flex-1">Zomato</span>
            </div>

            <button className="flex items-center gap-4 p-4 hover:bg-muted rounded-lg transition-colors w-full">
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-white">
                <span className="text-2xl">×</span>
              </div>
              <span className="font-semibold text-foreground">Request Account Deletion</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
