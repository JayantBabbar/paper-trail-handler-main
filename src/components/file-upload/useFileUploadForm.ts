
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';
import { useFileNumberGenerator } from "./hooks/useFileNumberGenerator";
import { useFileUpload } from "./hooks/useFileUpload";
import { useFileFormState } from "./hooks/useFileFormState";

export function useFileUploadForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    generatedFileNumber,
    setGeneratedFileNumber,
    isGenerating,
    generateFileNumber,
  } = useFileNumberGenerator();

  const {
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
  } = useFileUpload();

  const {
    date,
    setDate,
    needsReturn,
    setNeedsReturn,
    fileType,
    setFileType,
    title,
    setTitle,
    department,
    setDepartment,
    otherDepartment,
    setOtherDepartment,
    description,
    setDescription,
    remarks,
    setRemarks,
    resetForm,
  } = useFileFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileType) {
      toast({
        title: "Error",
        description: "Please select a file type",
      });
      return;
    }

    if (!generatedFileNumber) {
      toast({
        title: "Error",
        description: "Please generate a file number first",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the file",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Form submission started");

    try {
      // If "Other" is selected, save the custom department first
      if (department === "Other" && otherDepartment) {
        console.log("Adding custom department:", otherDepartment);
        const { error: deptError } = await supabase.rpc('add_custom_department', {
          department_name: otherDepartment
        });

        if (deptError) {
          console.error("Department error:", deptError);
          throw deptError;
        }

        // Invalidate departments query to refresh the dropdown
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      }

      const fileId = uuidv4();
      console.log("Generated file ID:", fileId);
      
      let storagePath = null;
      
      try {
        if (fileDetails) {
          console.log("Uploading file:", fileDetails.name);
          storagePath = await uploadFile(fileId);
          console.log("Storage path:", storagePath);
        }
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        toast({
          title: "Warning",
          description: "The file metadata was saved, but the file upload failed. You can try to upload the file again later.",
        });
      }

      // Prepare the data for insertion
      const fileData = {
        id: fileId,
        file_number: generatedFileNumber,
        title,
        type: fileType,
        department: department === "Other" ? otherDepartment : department,
        date: date.toISOString(),
        status: needsReturn ? "Pending" : "Completed",
        description,
        remarks,
        needs_return: needsReturn,
        storage_path: storagePath,
      };
      
      console.log("Inserting file data:", fileData);
      
      const { error: insertError } = await supabase
        .from('files')
        .insert(fileData);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("File record created successfully");
      queryClient.invalidateQueries({ queryKey: ['files'] });

      toast({
        title: "File uploaded successfully",
        description: "Your file has been processed and saved.",
      });

      // Reset form
      setFileDetails(null);
      resetForm();
      setGeneratedFileNumber("");

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error uploading file",
        description: error.message || "There was an error uploading your file. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState: {
      date,
      fileDetails,
      isDragging,
      needsReturn,
      fileType,
      title,
      department,
      otherDepartment,
      description,
      remarks,
      isSubmitting,
      generatedFileNumber,
      isGenerating,
    },
    handlers: {
      setDate,
      setNeedsReturn,
      setFileType,
      setTitle,
      setDepartment,
      setOtherDepartment,
      setDescription,
      setRemarks,
      generateFileNumber: () => generateFileNumber(fileType),
      setGeneratedFileNumber,
      handleSubmit,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileChange,
    },
  };
}
