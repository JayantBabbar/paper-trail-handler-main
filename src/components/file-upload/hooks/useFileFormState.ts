
import { useState } from "react";

export function useFileFormState() {
  const [date, setDate] = useState<Date>(new Date());
  const [needsReturn, setNeedsReturn] = useState(false);
  const [fileType, setFileType] = useState<"dispatched" | "received" | "internal">("dispatched");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");

  const resetForm = () => {
    setTitle("");
    setDepartment("");
    setOtherDepartment("");
    setDescription("");
    setRemarks("");
    setNeedsReturn(false);
    setFileType("dispatched");
    setDate(new Date());
  };

  return {
    date,
    setDate,
    needsReturn,
    setNeedsReturn,
    fileType,
    setFileType,
    title,
    setTitle,
    department,
    setDepartment,
    otherDepartment,
    setOtherDepartment,
    description,
    setDescription,
    remarks,
    setRemarks,
    resetForm,
  };
}
