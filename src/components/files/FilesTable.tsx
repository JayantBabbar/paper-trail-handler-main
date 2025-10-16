
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { FileTableRow } from "./FileTableRow";
import { FileRecord } from "@/hooks/useFileState";

interface FilesTableProps {
  files: FileRecord[];
  onSort: (key: keyof FileRecord) => void;
  onAction: (fileId: string, action: string) => void;
}

export function FilesTable({ files, onSort, onAction }: FilesTableProps) {
  const columns = [
    { key: 'fileNumber', label: 'File Number' },
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { key: 'department', label: 'Department' },
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className="cursor-pointer whitespace-nowrap px-4 py-2"
                onClick={() => onSort(column.key as keyof FileRecord)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <FileTableRow key={file.id} file={file} onAction={onAction} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
