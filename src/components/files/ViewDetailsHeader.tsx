import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ViewDetailsHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end mb-6">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Files
      </Button>
    </div>
  );
}