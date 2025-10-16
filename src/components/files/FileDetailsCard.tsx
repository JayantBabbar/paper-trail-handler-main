import { format } from "date-fns";
import { FileRecord } from "@/hooks/useFileState";
import { StatusHistory } from "./StatusHistory";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FileDetailsCardProps {
  fileDetails: FileRecord;
}

export function FileDetailsCard({ fileDetails }: FileDetailsCardProps) {
  const handleViewFile = async () => {
    if (fileDetails.storage_path) {
      const { data } = await supabase.storage
        .from('files')
        .createSignedUrl(fileDetails.storage_path, 60);

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">File Number</h3>
          <p className="mt-1">{fileDetails.fileNumber}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
          <p className="mt-1">{fileDetails.title}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
          <p className="mt-1">{fileDetails.type}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
          <p className="mt-1">{fileDetails.department}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
          <p className="mt-1">{format(fileDetails.date, "PPP")}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <p className="mt-1">{fileDetails.status}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <p className="mt-1">{fileDetails.description || 'No description provided'}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
          <p className="mt-1">{fileDetails.remarks || 'No remarks provided'}</p>
        </div>

        {fileDetails.storage_path && (
          <div className="md:col-span-2">
            <Button
              variant="outline"
              onClick={handleViewFile}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View File
            </Button>
          </div>
        )}

        <StatusHistory history={fileDetails.statusHistory} />
      </div>
    </div>
  );
}