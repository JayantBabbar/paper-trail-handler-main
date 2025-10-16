import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

interface FileActionsDropdownProps {
  fileId: string;
  fileType: "dispatched" | "received" | "internal";
  status: string;
  onAction: (fileId: string, action: string) => void;
}

export function FileActionsDropdown({ 
  fileId, 
  fileType, 
  status, 
  onAction 
}: FileActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAction(fileId, "view")}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction(fileId, "edit")}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        {status !== "Completed" && fileType !== "internal" && (
          <>
            <DropdownMenuSeparator />
            {fileType === "dispatched" && (
              <DropdownMenuItem onClick={() => onAction(fileId, "return")}>
                Mark as Returned
              </DropdownMenuItem>
            )}
            {fileType === "received" && (
              <DropdownMenuItem onClick={() => onAction(fileId, "dispatch")}>
                Mark as Dispatched
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onAction(fileId, "delete")}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}