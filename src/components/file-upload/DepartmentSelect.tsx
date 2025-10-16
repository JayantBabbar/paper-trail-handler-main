
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  otherDepartment: string;
  onOtherDepartmentChange: (value: string) => void;
  departments: string[];
}

export function DepartmentSelect({ 
  value, 
  onChange,
  otherDepartment,
  onOtherDepartmentChange 
}: DepartmentSelectProps) {
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('name')
        .order('name');
      
      if (error) throw error;
      // Filter out "Other" from database results since we'll add it manually
      return data.map(d => d.name).filter(name => name.toLowerCase() !== 'other');
    }
  });

  return (
    <div className="space-y-2">
      <Label>Department</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select department..." />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
      
      {value === "Other" && (
        <div className="mt-2">
          <Label>Specify Department</Label>
          <Input
            placeholder="Enter department name"
            value={otherDepartment}
            onChange={(e) => onOtherDepartmentChange(e.target.value)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
}
