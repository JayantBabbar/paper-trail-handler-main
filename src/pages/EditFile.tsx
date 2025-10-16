import { useParams } from "react-router-dom";
import { EditFileForm } from "@/components/EditFileForm";
import { useFileState } from "@/hooks/useFileState";

export function EditFile() {
  const { id } = useParams();
  const { files } = useFileState();
  
  const fileDetails = files.find(f => f.id === id);
  
  if (!fileDetails) {
    return (
      <div className="container py-8">
        <h2>File not found</h2>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <EditFileForm fileId={id!} initialData={fileDetails} />
    </div>
  );
}