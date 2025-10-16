import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface FileRecord {
  id: string;
  fileNumber: string;
  title: string;
  type: "dispatched" | "received" | "internal";
  department: string;
  date: Date;
  status: string;
  description?: string;
  remarks?: string;
  needs_return: boolean;
  storage_path?: string;
  created_at?: Date;
  updated_at?: Date;
  statusHistory: {
    status: string;
    timestamp: Date;
    reason?: string;
  }[];
}

export const useFileState = () => {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      console.log('Fetching files from Supabase...');
      const { data: filesData, error: filesError } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (filesError) {
        console.error('Error fetching files:', filesError);
        throw filesError;
      }

      const { data: historyData, error: historyError } = await supabase
        .from('status_history')
        .select('*');

      if (historyError) {
        console.error('Error fetching status history:', historyError);
        throw historyError;
      }

      console.log('Files data:', filesData);
      console.log('History data:', historyData);

      return filesData.map(file => ({
        ...file,
        id: file.id,
        fileNumber: file.file_number,
        date: new Date(file.date),
        needsReturn: file.needs_return,
        statusHistory: historyData
          .filter(h => h.file_id === file.id)
          .map(h => ({
            status: h.status,
            timestamp: new Date(h.timestamp),
            reason: h.reason
          }))
      })) as FileRecord[];
    }
  });

  const updateFileStatusMutation = useMutation({
    mutationFn: async ({ 
      fileId, 
      newStatus, 
      reason 
    }: { 
      fileId: string; 
      newStatus: string; 
      reason?: string 
    }) => {
      console.log('Updating file status:', { fileId, newStatus, reason });
      
      // Update file status
      const { error: fileError } = await supabase
        .from('files')
        .update({ status: newStatus })
        .eq('id', fileId);

      if (fileError) throw fileError;

      // Add status history
      const { error: historyError } = await supabase
        .from('status_history')
        .insert({
          file_id: fileId,
          status: newStatus,
          reason
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: error.message,
      });
    }
  });

  const updateFileStatus = (fileId: string, newStatus: string, reason?: string) => {
    updateFileStatusMutation.mutate({ fileId, newStatus, reason });
  };

  return {
    files,
    isLoading,
    updateFileStatus
  };
};
