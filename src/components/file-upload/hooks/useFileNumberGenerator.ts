import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function useFileNumberGenerator() {
  const [generatedFileNumber, setGeneratedFileNumber] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateFileNumber = async (fileType: "dispatched" | "received" | "internal") => {
    setIsGenerating(true);
    try {
      const getFilePrefix = (type: "dispatched" | "received" | "internal") => {
        switch (type) {
          case "dispatched":
            return "DISP";
          case "received":
            return "REC";
          case "internal":
            return "INT";
        }
      };
      
      const { data: existingFiles } = await supabase
        .from('files')
        .select('id')
        .like('file_number', `FT/${getFilePrefix(fileType)}/%`);
      
      const sequenceNumber = (existingFiles?.length || 0) + 1;
      const fileNumber = `FT/${getFilePrefix(fileType)}/${sequenceNumber.toString().padStart(3, '0')}`;
      
      setGeneratedFileNumber(fileNumber);
      toast({
        title: "File number generated",
        description: `Your file number is: ${fileNumber}`,
      });
    } catch (error) {
      console.error('Error generating file number:', error);
      toast({
        title: "Error",
        description: "Failed to generate file number. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatedFileNumber,
    setGeneratedFileNumber,
    isGenerating,
    generateFileNumber,
  };
}