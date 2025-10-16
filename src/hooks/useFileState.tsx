import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
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
      console.log('Fetching files from API...');
      const filesData = await api.getFiles();
      // Expect backend to return files with status_history included
      return filesData.map((file: any) => ({
        ...file,
        id: file.id,
        fileNumber: file.file_number || file.fileNumber,
        date: new Date(file.date),
        needsReturn: file.needs_return || file.needsReturn || false,
        statusHistory: (file.status_history || file.statusHistory || []).map((h: any) => ({
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
      console.log('Updating file status via API:', { fileId, newStatus, reason });
      await api.updateFileStatus(fileId, newStatus, reason);
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
