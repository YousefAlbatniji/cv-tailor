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
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all
        ${selectedFile ? "cursor-default border-violet-400/50 bg-violet-500/10" : "cursor-pointer"}
        ${!selectedFile && isDragging ? "border-violet-400 bg-violet-500/15 scale-[1.01]" : ""}
        ${!selectedFile && !isDragging ? "border-white/15 bg-black/20 hover:border-violet-400/60 hover:bg-violet-500/5" : ""}`}
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
          <FileText className="w-8 h-8 text-violet-300 flex-shrink-0" />
          <span className="text-gray-100 font-medium truncate max-w-xs">{selectedFile.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="ml-1 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div>
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-violet-300" />
          </div>
          <p className="text-gray-200 font-medium">Drop your CV here or click to browse</p>
          <p className="text-gray-500 text-sm mt-1">PDF or DOCX · max 10 MB</p>
        </div>
      )}
    </div>
  );
}
