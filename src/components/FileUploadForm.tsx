
import { Button } from "@/components/ui/button";
import { FileTypeSelect } from "./file-upload/FileTypeSelect";
import { FileNumberGenerator } from "./file-upload/FileNumberGenerator";
import { DepartmentSelect } from "./file-upload/DepartmentSelect";
import { FileDropZone } from "./file-upload/FileDropZone";
import { ReturnCheckbox } from "./file-upload/ReturnCheckbox";
import { FileUploadFields } from "./file-upload/FileUploadFields";
import { useFileUploadForm } from "./file-upload/useFileUploadForm";

export function FileUploadForm() {
  const { formState, handlers } = useFileUploadForm();
  
  return (
    <form onSubmit={handlers.handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-semibold mb-6">Upload New File</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FileTypeSelect
            value={formState.fileType}
            onChange={(value) => {
              handlers.setFileType(value);
              handlers.setGeneratedFileNumber("");
            }}
          />

          <FileNumberGenerator
            fileType={formState.fileType}
            generatedFileNumber={formState.generatedFileNumber}
            isGenerating={formState.isGenerating}
            onGenerate={handlers.generateFileNumber}
          />

          <FileUploadFields
            title={formState.title}
            date={formState.date}
            description={formState.description}
            remarks={formState.remarks}
            onTitleChange={handlers.setTitle}
            onDateChange={handlers.setDate}
            onDescriptionChange={handlers.setDescription}
            onRemarksChange={handlers.setRemarks}
          />

          <div className="md:col-span-2">
            <DepartmentSelect
              value={formState.department}
              onChange={handlers.setDepartment}
              otherDepartment={formState.otherDepartment}
              onOtherDepartmentChange={handlers.setOtherDepartment}
              departments={[]}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <ReturnCheckbox
              checked={formState.needsReturn}
              onChange={handlers.setNeedsReturn}
              fileType={formState.fileType}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <FileDropZone
              isDragging={formState.isDragging}
              fileDetails={formState.fileDetails}
              onDragOver={handlers.handleDragOver}
              onDragLeave={handlers.handleDragLeave}
              onDrop={handlers.handleDrop}
              onFileChange={handlers.handleFileChange}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>
    </form>
  );
}
