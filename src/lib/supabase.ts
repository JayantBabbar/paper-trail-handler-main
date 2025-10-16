
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize storage bucket if needed
export const initializeStorage = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const filesBucketExists = buckets?.some(bucket => bucket.name === 'files');
  
  if (!filesBucketExists) {
    const { error } = await supabase.storage.createBucket('files', {
      public: true,
      fileSizeLimit: 50000000, // 50MB
    });
    
    if (error) {
      console.error('Error creating files bucket:', error);
    } else {
      console.log('Files bucket created successfully');
    }
  }
};

interface FileRecord {
  id: string;
  file_number: string;
  title: string;
  type: 'Dispatched' | 'Received' | 'Internal';
  department: string;
  date: string;
  status: string;
  description: string | null;
  remarks: string | null;
  needs_return: boolean;
  created_at: string;
  updated_at: string;
  storage_path: string | null;
}

interface StatusHistoryRecord {
  id: string;
  file_id: string;
  status: string;
  reason: string | null;
  timestamp: string;
}

export type Database = {
  public: {
    Tables: {
      files: {
        Row: FileRecord;
        Insert: Omit<FileRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FileRecord, 'id'>>;
      };
      status_history: {
        Row: StatusHistoryRecord;
        Insert: Omit<StatusHistoryRecord, 'id' | 'timestamp'>;
        Update: Partial<Omit<StatusHistoryRecord, 'id'>>;
      };
    };
  };
};
