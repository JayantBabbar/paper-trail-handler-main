import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ReturnCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  fileType: "dispatched" | "received" | "internal";
}

export function ReturnCheckbox({ checked, onChange, fileType }: ReturnCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="needsReturn"
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        disabled={fileType === "internal"}
      />
      <Label htmlFor="needsReturn">
        {fileType === "dispatched" 
          ? "This file needs to be returned" 
          : fileType === "received"
          ? "This file needs to be dispatched back"
          : "Return/Dispatch not applicable for internal files"}
      </Label>
    </div>
  );
}