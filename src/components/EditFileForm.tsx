import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FileRecord } from "@/hooks/useFileState";

const departments = [
"IRD Accounts",
"Department of Strategy & Planning",
"CARE",
"Applied Mechanics",
"Civil Engg.",
"HSS",
"Elect. Engg.",
"Mech. Engg.",
"Project",
"CSC",
"DESE",
"C.A.R.T.",
"Chemistry",
"Corporate Relations",
"Chem.Engg.",
"ScAI",
"Design",
"CSE",
"Textile & Fiber Engg.",
"TRIPC",
"DMSE",
"SeNSE",
"BHARTI SCHOOL OF TELECOMMUNICATIONS TECHNOLOGY & MANAGEMENT",
"CENTRE FOR RURAL DEVELOPMENT AND TECHNOLOGY",
"CRDT",
];

interface EditFileFormProps {
  fileId: string;
  initialData: FileRecord;
}

export function EditFileForm({ fileId, initialData }: EditFileFormProps) {
  const [date, setDate] = useState<Date>(new Date(initialData.date));
  const [needsReturn, setNeedsReturn] = useState(initialData.needs_return);
  const [fileType, setFileType] = useState<"dispatched" | "received" | "internal">(initialData.type as "dispatched" | "received" | "internal");
  const [title, setTitle] = useState(initialData.title);
  const [department, setDepartment] = useState(initialData.department);
  const [description, setDescription] = useState(initialData.description || "");
  const [remarks, setRemarks] = useState(initialData.remarks || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.updateFile(fileId, {
        title,
        type: fileType,
        department,
        date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        description,
        remarks,
        needs_return: needsReturn,
      });

      // Refresh files list
      queryClient.invalidateQueries({ queryKey: ['files'] });

      toast({
        title: "File updated successfully",
        description: "Your changes have been saved.",
      });

      // Navigate back to files list
      navigate('/');

    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error updating file",
        description: "There was an error updating your file. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-semibold mb-6">Edit File</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter file title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">File Type</Label>
            <Select 
              value={fileType}
              onValueChange={(value: "dispatched" | "received" | "internal") => setFileType(value)}
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

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={department}
              onValueChange={setDepartment}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept.toLowerCase()}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter file description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Add any additional remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needsReturn"
                checked={needsReturn}
                onCheckedChange={(checked) => setNeedsReturn(checked as boolean)}
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
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}