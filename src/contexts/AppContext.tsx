import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface UploadedFile {
  id: string;
  filename: string;
  platform: string;
  rows_detected: number;
  date_uploaded: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  upload_id: string;
  platform: string;
  amount_numeric: number;
  txn_date: string | null;
  trip_id: string | null;
  meta_jsonb: any;
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
  transactions: Transaction[];
  fetchUploadedFiles: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  removeUploadedFile: (id: string) => Promise<void>;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<IncomeMetrics | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [timePeriod, setTimePeriod] = useState<'3' | '6' | '12'>('3');

  const fetchUploadedFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('user_id', user.id)
        .order('date_uploaded', { ascending: false });

      if (error) throw error;
      setUploadedFiles(data || []);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('txn_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const removeUploadedFile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Also delete associated transactions
      await supabase
        .from('transactions')
        .delete()
        .eq('upload_id', id);
      
      setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        uploadedFiles,
        transactions,
        fetchUploadedFiles,
        fetchTransactions,
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
