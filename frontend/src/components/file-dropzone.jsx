"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState, useEffect } from "react";

const FileDropzone = ({ onFileSelect }) => {
  const [files, setFiles] = useState(null);

  const handleDrop = (acceptedFiles) => {
    const first = acceptedFiles[0];

    // Check if it's already a File or wrapped
    const file = first instanceof File ? first : first.file;

    setFiles(file);
    if (onFileSelect) onFileSelect(file);
  };

  // cleanup blob URLs if needed
  useEffect(() => {
    return () => {
      if (files instanceof File) {
        URL.revokeObjectURL(files.preview);
      }
    };
  }, [files]);

  return (
    <div className="h-full">
      <Dropzone
        accept={{ "image/*": [] }}
        maxFiles={1}
        maxSize={1024 * 1024 * 10}
        minSize={1024}
        onDrop={handleDrop}
        onError={console.error}
        className="h-full flex flex-col justify-center border-dashed border-2 rounded-lg"
      >
        <DropzoneEmptyState className="flex-1 flex items-center justify-center" />
        <DropzoneContent className="flex-1 flex items-center justify-center" />
      </Dropzone>
    </div>
  );
};

export default FileDropzone;
