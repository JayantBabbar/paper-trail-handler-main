
import { useState } from "react";
import { FileUploadForm } from "@/components/FileUploadForm";
import { FilesList } from "@/components/FilesList";
import { ViewDetails } from "@/components/ViewDetails";
import { Button } from "@/components/ui/button";
import { PlusCircle, List } from "lucide-react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const [view, setView] = useState<"list" | "upload">("list");
  const { id } = useParams();
  

  if (id) {
    return (
      <div className="min-h-screen bg-[#F6F6F7]">
        <Navbar />
        <div className="pt-[calc(2.5rem+20px)]">
          <ViewDetails />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7]">
      <Navbar />
      <div className="container max-w-full py-2 pt-[calc(2.5rem+20px)] px-2 md:px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold font-inter text-[#222222]">
           DAK-System
          </h1>
          <Button
            onClick={() => setView(view === "list" ? "upload" : "list")}
            className="flex items-center gap-2 bg-[#ea384c] hover:bg-[#ea384c]/90 w-full md:w-auto"
          >
            {view === "list" ? (
              <>
                <PlusCircle className="h-4 w-4" />
                New File
              </>
            ) : (
              <>
                <List className="h-4 w-4" />
                View Files
              </>
            )}
          </Button>
        </div>

        {view === "upload" ? <FileUploadForm /> : <FilesList />}
      </div>
    </div>
  );
};

export default Index;
