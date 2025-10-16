import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileStatusBadge } from "./FileStatusBadge";
import { FileActionsDropdown } from "./FileActionsDropdown";
import { FileRecord } from "@/hooks/useFileState";

interface FileTableRowProps {
  file: FileRecord;
  onAction: (fileId: string, action: string) => void;
}

export function FileTableRow({ file, onAction }: FileTableRowProps) {
  return (
    <TableRow key={file.id} className="hover:bg-gray-50">
      <TableCell className="font-medium whitespace-nowrap">{file.fileNumber}</TableCell>
      <TableCell className="max-w-[200px] truncate">{file.title}</TableCell>
      <TableCell className="whitespace-nowrap">{file.type}</TableCell>
      <TableCell className="whitespace-nowrap">{file.department}</TableCell>
      <TableCell className="whitespace-nowrap">{format(file.date, "PP")}</TableCell>
      <TableCell className="max-w-[200px] truncate">{file.description || '-'}</TableCell>
      <TableCell className="max-w-[200px] truncate">{file.remarks || '-'}</TableCell>
      <TableCell>
        <FileStatusBadge status={file.status} />
      </TableCell>
      <TableCell>
        <FileActionsDropdown
          fileId={file.id}
          fileType={file.type}
          status={file.status}
          onAction={onAction}
        />
      </TableCell>
    </TableRow>
  );
}