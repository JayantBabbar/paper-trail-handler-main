
import { useState } from "react";
import api from "@/lib/api";
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
    const form = new FormData();
    form.append('file', fileDetails, fileDetails.name);

    const body = await api.uploadFile(form);
    return body.storage_path;
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
