
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

export function useFileUpload() {
  const [fileDetails, setFileDetails] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileDetails(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileDetails(e.target.files[0]);
    }
  };

  const uploadFile = async (fileId: string) => {
    if (!fileDetails) return null;

    // First, try to initialize the bucket if needed
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some(bucket => bucket.name === 'files')) {
        await supabase.storage.createBucket('files', {
          public: true,
          fileSizeLimit: 50000000, // 50MB
        });
        console.log('Created files bucket');
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
    }

    const fileExt = fileDetails.name.split('.').pop();
    const fileName = `${fileId}.${fileExt}`;
    
    try {
      // Attempt to upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('files')
        .upload(fileName, fileDetails, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', data.path);
      return data.path;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  };

  return {
    fileDetails,
    setFileDetails,
    isDragging,
    isSubmitting,
    setIsSubmitting,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    uploadFile,
  };
}
