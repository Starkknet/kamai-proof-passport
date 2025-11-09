import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const UploadPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { uploadedFiles, fetchUploadedFiles, removeUploadedFile } = useApp();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch uploaded files when component mounts
  useEffect(() => {
    if (user) {
      fetchUploadedFiles();
    }
  }, [user]);

  const detectPlatform = (headers: string[]): string => {
    const headerStr = headers.join(' ').toLowerCase();
    if (headerStr.includes('swiggy')) return 'Swiggy';
    if (headerStr.includes('zomato')) return 'Zomato';
    if (headerStr.includes('uber')) return 'Uber';
    if (headerStr.includes('rapido')) return 'Rapido';
    if (headerStr.includes('urbanclap') || headerStr.includes('urban')) return 'UrbanClap';
    return 'Unknown Platform';
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload files",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const headers = results.meta.fields || [];
          const platform = detectPlatform(headers);
          const rowCount = results.data.length;

          // Insert into uploaded_files table
          const { data: uploadData, error: uploadError } = await supabase
            .from('uploaded_files')
            .insert({
              user_id: user.id,
              filename: file.name,
              platform: platform,
              rows_detected: rowCount,
              date_uploaded: new Date().toISOString(),
            })
            .select()
            .single();

          if (uploadError) throw uploadError;

          // Parse and prepare transactions
          const transactions = [];
          for (const row of results.data as any[]) {
            // Find amount column
            const amountKey = Object.keys(row).find(key => 
              ['amount', 'Amount', 'earnings', 'Earnings', 'payment', 'Payment', 'payout'].includes(key)
            );
            
            // Find date column
            const dateKey = Object.keys(row).find(key =>
              ['date', 'Date', 'transaction_date', 'trip_date', 'dt'].includes(key)
            );
            
            // Find trip ID column
            const tripIdKey = Object.keys(row).find(key =>
              ['trip_id', 'order_id', 'delivery_id'].includes(key)
            );

            // Parse amount (remove ₹, commas, etc.)
            let amount = 0;
            if (amountKey && row[amountKey]) {
              const amountStr = String(row[amountKey]).replace(/[₹,\s]/g, '');
              amount = parseFloat(amountStr) || 0;
            }

            // Parse date
            let txnDate = null;
            if (dateKey && row[dateKey]) {
              const dateVal = new Date(row[dateKey]);
              if (!isNaN(dateVal.getTime())) {
                txnDate = dateVal.toISOString();
              }
            }

            transactions.push({
              user_id: user.id,
              upload_id: uploadData.id,
              platform: platform,
              amount_numeric: amount,
              txn_date: txnDate,
              trip_id: tripIdKey ? row[tripIdKey] : null,
              meta_jsonb: row,
            });
          }

          // Batch insert transactions (1000 at a time)
          const chunkSize = 1000;
          for (let i = 0; i < transactions.length; i += chunkSize) {
            const chunk = transactions.slice(i, i + chunkSize);
            const { error: txnError } = await supabase
              .from('transactions')
              .insert(chunk);
            
            if (txnError) throw txnError;
          }

          // Refresh uploaded files list
          await fetchUploadedFiles();

          setIsProcessing(false);

          toast({
            title: "File uploaded successfully!",
            description: `${rowCount} transactions saved from ${platform}`,
          });
        } catch (error: any) {
          console.error('Upload error:', error);
          setIsProcessing(false);
          toast({
            title: "Failed to save",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        setIsProcessing(false);
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
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
              <a href="/" className="text-accent font-medium border-b-2 border-accent pb-1">Dashboard</a>
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Upload Card */}
        <Card className="p-8 md:p-12 shadow-hover mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Upload Your Earnings Data</h1>
              <p className="text-muted-foreground">Supported formats: CSV, Excel</p>
              <Button 
                className="bg-accent hover:bg-accent/90 text-white" 
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                ₹ Upload Data
              </Button>
            </div>
            
            <div
              className={`border-2 border-dashed border-accent rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragging ? 'bg-accent/5 scale-105' : 'hover:bg-accent/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center relative">
                  <Upload className="w-12 h-12 text-white" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">₹</span>
                  </div>
                </div>
                {isProcessing ? (
                  <>
                    <p className="text-muted-foreground">Processing...</p>
                    <p className="text-sm text-muted-foreground mt-2">Saving to database...</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-foreground">Drag & Drop your CSV file here</h3>
                    <p className="text-muted-foreground">or browse files</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Uploads */}
        {uploadedFiles.length > 0 && (
          <Card className="p-8 shadow-card">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Uploads</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">{file.rows_detected} rows uploaded</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      await removeUploadedFile(file.id);
                      await fetchUploadedFiles();
                    }}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                className="bg-accent hover:bg-accent/90 text-white"
                onClick={() => navigate('/dashboard')}
              >
                Upload Data
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
