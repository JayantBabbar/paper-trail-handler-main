import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNumberGeneratorProps {
  fileType: "dispatched" | "received" | "internal";
  generatedFileNumber: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function FileNumberGenerator({ 
  fileType, 
  generatedFileNumber, 
  isGenerating, 
  onGenerate 
}: FileNumberGeneratorProps) {
  if (!fileType) return null;

  if (!generatedFileNumber) {
    return (
      <div className="pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 w-full"
        >
          <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
          Generate File Number
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Label>File Number</Label>
      <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
        {generatedFileNumber}
      </div>
    </div>
  );
}