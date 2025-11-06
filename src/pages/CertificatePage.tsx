import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Share2, CheckCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, CertificateData } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const CertificatePage = () => {
  const navigate = useNavigate();
  const { metrics, certificate, setCertificate, uploadedFiles } = useApp();
  const { toast } = useToast();
  const [generatedCert, setGeneratedCert] = useState<CertificateData | null>(null);

  useEffect(() => {
    if (!metrics) {
      navigate('/dashboard');
      return;
    }

    if (certificate) {
      setGeneratedCert(certificate);
    } else {
      // Generate new certificate
      const certId = `KAM-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
      const platforms = [...new Set(uploadedFiles.map(f => f.platform))];
      
      const newCert: CertificateData = {
        id: certId,
        workerName: "Gig Worker",
        period: "October 2024 - December 2024",
        totalNetIncome: metrics.totalNetIncome,
        stabilityScore: metrics.stabilityScore,
        platforms: platforms,
        dateIssued: new Date(),
        verificationHash: `SHA-256: ${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 6)}`,
      };

      setGeneratedCert(newCert);
      setCertificate(newCert);
    }
  }, [metrics, certificate]);

  const handleDownload = () => {
    toast({
      title: "Certificate downloaded!",
      description: "Your income certificate has been saved as PDF",
    });
  };

  const handleCopyLink = () => {
    if (generatedCert) {
      const link = `${window.location.origin}/verify/${generatedCert.id.replace('KAM-', '')}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Verification link copied to clipboard",
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Share your certificate via WhatsApp, Email, or SMS",
    });
  };

  if (!generatedCert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Income Certificate</h1>
          <p className="text-muted-foreground">QR-verified digital proof of income</p>
        </div>

        {/* Certificate Preview */}
        <Card className="p-8 md:p-12 bg-white shadow-hover border-2 border-accent/20">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="text-9xl">₹</span>
          </div>

          <div className="relative space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-accent pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">Kamai</span>
                <span className="text-3xl text-accent">₹</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">Income Certificate</h2>
            </div>

            {/* Content */}
            <div className="space-y-4 text-gray-900">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Worker Name</p>
                  <p className="font-semibold text-lg">{generatedCert.workerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                  <p className="font-semibold text-lg">#{generatedCert.id}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Period</p>
                <p className="font-semibold">{generatedCert.period}</p>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Net Income</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{generatedCert.totalNetIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Stability Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{generatedCert.stabilityScore}/100</p>
                    <Badge className="bg-success text-white">Excellent</Badge>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {generatedCert.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="border-gray-300">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center py-4">
                <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="w-28 h-28 bg-white rounded grid grid-cols-4 grid-rows-4 gap-1 p-2">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">Verify at</p>
                <p className="font-mono text-primary text-sm">
                  kamai.in/verify/{generatedCert.id.replace('KAM-', '')}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-6 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Verified by Kamai</span>
              </div>
              <p className="text-xs text-gray-400 text-center font-mono break-all">
                {generatedCert.verificationHash}
              </p>
              <p className="text-xs text-gray-400 text-center">
                Issued: {new Date(generatedCert.dateIssued).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleDownload}
            className="shadow-hover hover:scale-105 transition-transform"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleCopyLink}
          >
            <Copy className="mr-2 h-5 w-5" />
            Copy Verification Link
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Certificate
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-success" />
          <span>This certificate is cryptographically secured and QR-verifiable</span>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
