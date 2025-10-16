
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { TableHeader } from "./files/TableHeader";
import { FilesTable } from "./files/FilesTable";
import { TablePagination } from "./files/TablePagination";
import { useToast } from "@/hooks/use-toast";
import { useFileState, FileRecord } from "@/hooks/useFileState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function FilesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { files, updateFileStatus } = useFileState();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FileRecord;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;

  const handleSort = (key: keyof FileRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileToDelete);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
      });
    } else {
      // Invalidate the files query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['files'] });
      
      toast({
        title: "Success",
        description: "File has been deleted successfully.",
      });
    }

    setFileToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleAction = (fileId: string, action: string) => {
    if (action === "view") {
      navigate(`/files/${fileId}`);
    } else if (action === "edit") {
      navigate(`/files/${fileId}/edit`);
    } else if (action === "delete") {
      setFileToDelete(fileId);
      setDeleteDialogOpen(true);
    } else if (action === "return" || action === "dispatch") {
      updateFileStatus(fileId, "Completed");
      
      toast({
        title: "Status Updated",
        description: `File has been marked as ${action === "return" ? "returned" : "dispatched"}`,
      });
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredFiles = sortedFiles.filter((file) =>
    Object.values(file).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredFiles.map(file => ({
        ...file,
        date: format(file.date, 'PP'),
        statusHistory: file.statusHistory.map(change => ({
          status: change.status,
          timestamp: format(change.timestamp, 'PP p'),
          reason: change.reason || ''
        }))
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Files");
    XLSX.writeFile(workbook, "files_list.xlsx");
  };

  return (
    <div className="space-y-2 animate-fadeIn w-full">
      <TableHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        exportToExcel={exportToExcel}
      />

      <div className="glass-panel overflow-x-auto w-full px-2 py-2">
        <FilesTable 
          files={paginatedFiles}
          onSort={handleSort}
          onAction={handleAction}
        />

        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
