import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface UndoStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  undoReason: string;
  setUndoReason: (reason: string) => void;
  onConfirm: () => void;
}

export function UndoStatusDialog({
  isOpen,
  onOpenChange,
  undoReason,
  setUndoReason,
  onConfirm,
}: UndoStatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Undo File Status</DialogTitle>
          <DialogDescription>
            Please provide a reason for undoing the status of this file.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={undoReason}
            onChange={(e) => setUndoReason(e.target.value)}
            placeholder="Enter reason for undoing status..."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}