
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFileState } from "@/hooks/useFileState";
import { FileDetailsCard } from "./files/FileDetailsCard";
import { FileActions } from "./files/FileActions";
import { ViewDetailsHeader } from "./files/ViewDetailsHeader";
import { UndoStatusDialog } from "./files/UndoStatusDialog";

export function ViewDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const { files, updateFileStatus } = useFileState();
  const [isUndoDialogOpen, setIsUndoDialogOpen] = useState(false);
  const [undoReason, setUndoReason] = useState("");
  
  const fileDetails = files.find(f => f.id === id);
  
  if (!fileDetails) {
    return (
      <div className="container py-8">
        <h2>File not found</h2>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: string) => {
    updateFileStatus(fileDetails.id, newStatus);
    toast({
      title: "Status Updated",
      description: `File has been marked as ${newStatus}`,
    });
  };

  const handleUndoStatus = () => {
    if (!undoReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for undoing the status",
      });
      return;
    }

    updateFileStatus(fileDetails.id, "Pending", undoReason);
    setIsUndoDialogOpen(false);
    setUndoReason("");

    toast({
      title: "Status Updated",
      description: "File status has been reset to Pending",
    });
  };

  return (
    <div className="container py-8 pt-[calc(2.5rem+20px)] animate-fadeIn">
      <ViewDetailsHeader />

      <div className="text-left">
        <FileDetailsCard fileDetails={fileDetails} />
        
        <FileActions 
          type={fileDetails.type}
          status={fileDetails.status}
          fileId={fileDetails.id}
          fileTitle={fileDetails.title}
          onStatusUpdate={handleStatusUpdate}
          onUndoClick={() => setIsUndoDialogOpen(true)}
        />
      </div>

      <UndoStatusDialog 
        isOpen={isUndoDialogOpen}
        onOpenChange={setIsUndoDialogOpen}
        undoReason={undoReason}
        setUndoReason={setUndoReason}
        onConfirm={handleUndoStatus}
      />
    </div>
  );
}
