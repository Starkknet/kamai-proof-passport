import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield } from "lucide-react";
import { useParams } from "react-router-dom";

interface VerificationData {
  isValid: boolean;
  certificateId?: string;
  workerName?: string;
  period?: string;
  totalNetIncome?: number;
  stabilityScore?: number;
  platforms?: string[];
  dateIssued?: Date;
  verifiedAt: Date;
}

const VerifyPage = () => {
  const { id } = useParams();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate verification check
    setTimeout(() => {
      // Mock verification - in real app, this would call an API
      const isValid = id !== 'invalid';
      
      if (isValid) {
        setVerificationData({
          isValid: true,
          certificateId: `KAM-2024-${id}`,
          workerName: "Gig Worker",
          period: "October 2024 - December 2024",
          totalNetIncome: 42800,
          stabilityScore: 82,
          platforms: ["Swiggy", "Zomato"],
          dateIssued: new Date('2024-12-15'),
          verifiedAt: new Date(),
        });
      } else {
        setVerificationData({
          isValid: false,
          verifiedAt: new Date(),
        });
      }
      
      setIsLoading(false);
    }, 1500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (!verificationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/10 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="p-8 md:p-12 shadow-hover">
          {verificationData.isValid ? (
            <div className="space-y-6 text-center">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-success/10 rounded-full">
                  <CheckCircle className="h-16 w-16 text-success" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Certificate Verified</h1>
                <Badge className="bg-success text-white text-sm px-4 py-1">Valid</Badge>
              </div>

              {/* Certificate Details */}
              <div className="border-t pt-6 space-y-4 text-left">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Certificate ID</p>
                  <p className="font-semibold text-lg text-foreground">#{verificationData.certificateId}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Worker Name</p>
                    <p className="font-medium text-foreground">{verificationData.workerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Period</p>
                    <p className="font-medium text-foreground">{verificationData.period}</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Net Income</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{verificationData.totalNetIncome?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stability Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-foreground">{verificationData.stabilityScore}/100</p>
                    <Badge className="bg-success text-white">Excellent</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {verificationData.platforms?.map((platform) => (
                      <Badge key={platform} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Issued: {verificationData.dateIssued?.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified: {verificationData.verifiedAt.toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                <Shield className="h-4 w-4" />
                <span>Secured by Kamai</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <XCircle className="h-16 w-16 text-destructive" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Certificate Not Found</h1>
                <Badge variant="destructive" className="text-sm px-4 py-1">Invalid</Badge>
              </div>

              {/* Error Message */}
              <div className="border-t pt-6">
                <p className="text-muted-foreground">
                  The certificate you are trying to verify does not exist or may have been tampered with.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check the certificate ID and try again.
                </p>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                <Shield className="h-4 w-4" />
                <span>Secured by Kamai</span>
              </div>
            </div>
          )}
        </Card>

        {/* Certificate ID Display */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Certificate ID: <span className="font-mono">{id}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
