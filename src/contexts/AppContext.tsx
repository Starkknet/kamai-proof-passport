import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UploadedFile {
  id: string;
  filename: string;
  platform: string;
  rowsDetected: number;
  dateUploaded: Date;
  data: any[];
}

export interface IncomeMetrics {
  totalNetIncome: number;
  stabilityScore: number;
  activeWeeks: number;
  totalWeeks: number;
  platformBreakdown: { platform: string; amount: number; percentage: number }[];
  monthlyData: { month: string; income: number }[];
  trend: number;
}

export interface CertificateData {
  id: string;
  workerName: string;
  period: string;
  totalNetIncome: number;
  stabilityScore: number;
  platforms: string[];
  dateIssued: Date;
  verificationHash: string;
}

interface AppContextType {
  uploadedFiles: UploadedFile[];
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (id: string) => void;
  metrics: IncomeMetrics | null;
  setMetrics: (metrics: IncomeMetrics) => void;
  certificate: CertificateData | null;
  setCertificate: (cert: CertificateData) => void;
  timePeriod: '3' | '6' | '12';
  setTimePeriod: (period: '3' | '6' | '12') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [metrics, setMetrics] = useState<IncomeMetrics | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [timePeriod, setTimePeriod] = useState<'3' | '6' | '12'>('3');

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        uploadedFiles,
        addUploadedFile,
        removeUploadedFile,
        metrics,
        setMetrics,
        certificate,
        setCertificate,
        timePeriod,
        setTimePeriod,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
