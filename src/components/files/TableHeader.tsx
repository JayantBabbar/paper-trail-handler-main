import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TableHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  exportToExcel: () => void;
}

export function TableHeader({ searchTerm, setSearchTerm, exportToExcel }: TableHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button onClick={exportToExcel} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export to Excel
      </Button>
    </div>
  );
}