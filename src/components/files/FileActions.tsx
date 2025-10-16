
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EmailDialog } from "./EmailDialog";

interface FileActionsProps {
  type: string;
  status: string;
  fileId: string;
  fileTitle: string;
  onStatusUpdate: (newStatus: string) => void;
  onUndoClick: () => void;
}

export function FileActions({ type, status, fileId, fileTitle, onStatusUpdate, onUndoClick }: FileActionsProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  return (
    <div className="flex justify-end gap-2 mt-6">
      {status !== "Completed" && (
        <>
          {type === "received" && (
            <Button onClick={() => onStatusUpdate("Returned")}>
              Mark as Returned
            </Button>
          )}
          {type === "dispatched" && (
            <Button onClick={() => onStatusUpdate("Dispatched")}>
              Mark as Dispatched
            </Button>
          )}
        </>
      )}
      {status === "Completed" && (
        <Button variant="outline" onClick={onUndoClick}>
          Undo Status
        </Button>
      )}
      <Button variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
        Send Email
      </Button>

      <EmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        fileId={fileId}
        fileTitle={fileTitle}
      />
    </div>
  );
}
