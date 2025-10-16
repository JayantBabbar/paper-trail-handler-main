import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  isDragging: boolean;
  fileDetails: File | null;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropZone({
  isDragging,
  fileDetails,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: FileDropZoneProps) {
  return (
    <div className="space-y-2">
      <Label>Upload File</Label>
      <div
        className={cn("file-drop-zone", isDragging && "dragging")}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileChange}
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your file here, or click to select
          </p>
          {fileDetails && (
            <p className="mt-2 text-sm text-primary">
              Selected: {fileDetails.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}