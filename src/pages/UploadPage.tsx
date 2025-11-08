import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp, UploadedFile } from "@/contexts/AppContext";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

const UploadPage = () => {
  const navigate = useNavigate();
  const { uploadedFiles, addUploadedFile, removeUploadedFile } = useApp();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectPlatform = (headers: string[]): string => {
    const headerStr = headers.join(' ').toLowerCase();
    if (headerStr.includes('swiggy')) return 'Swiggy';
    if (headerStr.includes('zomato')) return 'Zomato';
    if (headerStr.includes('uber')) return 'Uber';
    if (headerStr.includes('rapido')) return 'Rapido';
    if (headerStr.includes('urbanclap') || headerStr.includes('urban')) return 'UrbanClap';
    return 'Unknown Platform';
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

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
      complete: (results) => {
        const headers = results.meta.fields || [];
        const platform = detectPlatform(headers);
        const rowCount = results.data.length;

        const uploadedFile: UploadedFile = {
          id: Date.now().toString(),
          filename: file.name,
          platform: platform,
          rowsDetected: rowCount,
          dateUploaded: new Date(),
          data: results.data,
        };

        addUploadedFile(uploadedFile);
        setIsProcessing(false);

        toast({
          title: "File uploaded successfully!",
          description: `${rowCount} rows detected from ${platform}`,
        });
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
              <Button className="bg-accent hover:bg-accent/90 text-white" onClick={() => navigate('/')}>Logout</Button>
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
                  <p className="text-muted-foreground">Processing...</p>
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
                    <p className="text-sm text-muted-foreground">{file.rowsDetected} rows uploaded</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUploadedFile(file.id)}
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
