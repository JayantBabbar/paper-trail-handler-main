import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadFieldsProps {
  title: string;
  date: Date;
  description: string;
  remarks: string;
  onTitleChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onDescriptionChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
}

export function FileUploadFields({
  title,
  date,
  description,
  remarks,
  onTitleChange,
  onDateChange,
  onDescriptionChange,
  onRemarksChange,
}: FileUploadFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          placeholder="Enter file title" 
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required 
        />
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
              onSelect={onDateChange}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          placeholder="Add any additional remarks"
          value={remarks}
          onChange={(e) => onRemarksChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </>
  );
}