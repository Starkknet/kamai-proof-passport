import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConnectPlatformsPage = () => {
  const navigate = useNavigate();

  const platforms = [
    { name: "Zomato", category: "Food Delivery", icon: "Z", color: "bg-red-500", connected: false },
    { name: "Swigar", category: "Food Delivery", icon: "S", color: "bg-pink-500", connected: false },
    { name: "Ola", category: "Food Delivery", icon: "O", color: "bg-yellow-500", connected: false },
    { name: "Uber", category: "E-commerce Logistics", icon: "U", color: "bg-black", connected: true },
    { name: "Flwport", category: "E-commerce Logistics", icon: "F", color: "bg-pink-600", connected: false },
    { name: "Uber", category: "Dignend", icon: "U", color: "bg-black", connected: false },
    { name: "Flimport Flex", category: "E-commerce Logistics", icon: "A", color: "bg-yellow-600", connected: false },
    { name: "amazon", category: "Digm dex", icon: "a", color: "bg-blue-400", connected: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Kamai</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="/dashboard" className="text-foreground font-medium hover:text-accent transition-colors">Dashboard</a>
              <a href="/history" className="text-foreground font-medium hover:text-accent transition-colors">History</a>
              <a href="/settings" className="text-foreground font-medium hover:text-accent transition-colors">Settings</a>
              <Button className="bg-accent hover:bg-accent/90 text-white" onClick={() => navigate('/')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Card className="p-8 md:p-12 border-2 border-accent">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-12">Connect Your Platforms</h1>

          {/* Platforms Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {platforms.map((platform, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">{platform.category}</p>
                  </div>
                </div>

                {platform.connected ? (
                  <CheckCircle2 className="w-8 h-8 text-success" />
                ) : (
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    ₹ Connect Now
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center space-y-4">
            <p className="text-xl font-semibold text-foreground">Not listed?</p>
            <a href="#" className="text-primary underline font-medium hover:text-accent transition-colors">
              Request New Platform
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConnectPlatformsPage;
