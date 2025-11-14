import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Skeleton } from "./components/ui/skeleton";

// Immediate loads
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Lazy loads
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const ConnectPlatformsPage = lazy(() => import("./pages/ConnectPlatformsPage"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:id" element={<Suspense fallback={<LoadingFallback />}><VerifyPage /></Suspense>} />
          <Route path="/upload" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><UploadPage /></ProtectedRoute></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><DashboardPage /></ProtectedRoute></Suspense>} />
          <Route path="/certificate" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><CertificatePage /></ProtectedRoute></Suspense>} />
          <Route path="/history" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><HistoryPage /></ProtectedRoute></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><SettingsPage /></ProtectedRoute></Suspense>} />
          <Route path="/connect-platforms" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><ConnectPlatformsPage /></ProtectedRoute></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><AboutPage /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><PrivacyPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<LoadingFallback />}><ContactPage /></Suspense>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
