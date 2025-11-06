import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'Swiggy': 'bg-orange-500',
      'Zomato': 'bg-red-500',
      'Uber': 'bg-black',
      'Rapido': 'bg-yellow-500',
      'UrbanClap': 'bg-blue-500',
    };
    return colors[platform] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Upload Your Earnings</h1>
          <p className="text-muted-foreground">
            Upload CSV files from your gig platforms to get started
          </p>
        </div>

        {/* Upload Card */}
        <Card className="p-8 shadow-card">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
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
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
              </div>

              {isProcessing ? (
                <div className="space-y-2">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-muted-foreground">Processing your file...</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      Drop your earnings CSVs here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported: Swiggy, Zomato, Uber, Rapido, UrbanClap
                    </p>
                  </div>
                  <Button variant="outline" size="lg">
                    <Upload className="mr-2 h-5 w-5" />
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Recent Uploads */}
        {uploadedFiles.length > 0 && (
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Uploads</h2>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.filename}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span className={`px-2 py-0.5 ${getPlatformColor(file.platform)} text-white rounded text-xs`}>
                          {file.platform}
                        </span>
                        <span>• {file.rowsDetected} rows</span>
                        <span>• {new Date(file.dateUploaded).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUploadedFile(file.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Button */}
        {uploadedFiles.length > 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="px-8 shadow-hover hover:scale-105 transition-transform"
            >
              Proceed to Dashboard
            </Button>
          </div>
        )}

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Your data is private and will be auto-deleted after 30 days</span>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
