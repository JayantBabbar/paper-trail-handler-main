import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FileTypeSelectProps {
  value: "dispatched" | "received" | "internal";
  onChange: (value: "dispatched" | "received" | "internal") => void;
}

export function FileTypeSelect({ value, onChange }: FileTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">File Type</Label>
      <Select 
        value={value}
        onValueChange={onChange}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dispatched">Dispatched</SelectItem>
          <SelectItem value="received">Received</SelectItem>
          <SelectItem value="internal">Internal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}