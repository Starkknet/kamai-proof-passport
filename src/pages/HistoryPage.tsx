import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();

  const certificates = [
    { id: "#KM023-01-XYZ123", date: "Jan 15, 2023", status: "Verified", icon: "✓" },
    { id: "#KM023-01-XYZ123", date: "Jan 15, 2023", status: "Verified", icon: "✓" },
    { id: "#KM023-01-XYZ123", date: "Jan 15, 2023", status: "Pending", icon: "⏱" },
    { id: "#KM023-01-XYZ123", date: "Jan 15, 2023", status: "Verified", icon: "⚠" },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🪷</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Kamai</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="/dashboard" className="text-foreground font-medium hover:text-accent transition-colors">Dashboard</a>
              <a href="/history" className="text-accent font-medium border-b-2 border-accent pb-1">History</a>
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
        <Card className="p-8 md:p-12 bg-card">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Verification History</h1>

          {/* Table */}
          <Card className="border-2 border-accent rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6 font-semibold text-primary">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">₹</span>
                  </div>
                  Certificate ID
                </div>
                <div>Date</div>
                <div>Status</div>
                <div>View Details</div>
              </div>

              {certificates.map((cert, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-4 border-t items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">₹</span>
                    </div>
                    <span className="font-medium text-foreground">{cert.id}</span>
                  </div>
                  <div className="text-muted-foreground">{cert.date}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{cert.status}</span>
                    {cert.status === "Verified" && cert.icon === "✓" && <CheckCircle2 className="w-5 h-5 text-success" />}
                    {cert.status === "Pending" && <Clock className="w-5 h-5 text-success" />}
                    {cert.icon === "⚠" && <span className="text-warning">⚠</span>}
                  </div>
                  <div>
                    <Button variant="outline" className="bg-accent/10 text-accent border-accent hover:bg-accent hover:text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Card>

        {/* Recent Platforms */}
        <Card className="mt-8 p-8 bg-card">
          <h2 className="text-2xl font-bold text-primary mb-6">Recent Platforms</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold">Z</div>
              <span className="font-medium text-foreground">zomato</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white font-bold">S</div>
              <span className="font-medium text-foreground">Swiggato</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">B</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white font-bold">S</div>
              <span className="font-medium text-foreground">Swiggato</span>
            </div>
            <Button className="ml-auto bg-accent hover:bg-accent/90 text-white">
              Connect New Platform
            </Button>
          </div>
        </Card>
      </div>

      {/* Decorative Star */}
      <div className="fixed bottom-8 right-8 text-6xl opacity-20">✦</div>
    </div>
  );
};

export default HistoryPage;
