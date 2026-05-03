import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { Upload, FileText, X } from "lucide-react";

interface Props {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function FileUpload({ selectedFile, onFileSelect, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onClick={() => !selectedFile && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
        ${selectedFile ? "cursor-default border-indigo-300 bg-indigo-50" : "cursor-pointer"}
        ${!selectedFile && isDragging ? "border-indigo-500 bg-indigo-50" : ""}
        ${!selectedFile && !isDragging ? "border-gray-300 hover:border-indigo-400 hover:bg-gray-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />

      {selectedFile ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-8 h-8 text-indigo-500 flex-shrink-0" />
          <span className="text-gray-700 font-medium truncate max-w-xs">
            {selectedFile.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div>
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            Drop your CV here or click to browse
          </p>
          <p className="text-gray-400 text-sm mt-1">PDF or DOCX — max 10 MB</p>
        </div>
      )}
    </div>
  );
}
