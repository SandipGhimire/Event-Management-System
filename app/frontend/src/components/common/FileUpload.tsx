import { Upload, X } from "lucide-react";
import React, { useRef, useState, useCallback, useEffect } from "react";

interface FileUploadProps {
  id: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  onChange: (file: File | null) => void;
  previewUrl?: string | null;
  error?: string;
  className?: string;
}

export default function FileUpload({
  id,
  label,
  accept = "*",
  maxSize = 5, // Default 5MB
  onChange,
  previewUrl: externalPreviewUrl,
  error,
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayPreviewUrl = externalPreviewUrl || internalPreviewUrl;

  // Clean up internal preview URL on unmount
  useEffect(() => {
    return () => {
      if (internalPreviewUrl) {
        URL.revokeObjectURL(internalPreviewUrl);
      }
    };
  }, [internalPreviewUrl]);

  const validateFile = useCallback(
    (file: File): boolean => {
      setValidationError(null);

      // Type validation
      if (accept !== "*") {
        const allowedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        const isAllowed = allowedTypes.some((type) => {
          if (type.startsWith("image/")) {
            return fileType.startsWith("image/");
          }
          if (type.startsWith(".")) {
            return fileName.endsWith(type);
          }
          return fileType === type;
        });

        if (!isAllowed) {
          setValidationError(`File type not allowed. Please upload ${accept}`);
          return false;
        }
      }

      // Size validation
      if (file.size > maxSize * 1024 * 1024) {
        setValidationError(`File size exceeds ${maxSize}MB limit.`);
        return false;
      }

      return true;
    },
    [accept, maxSize]
  );

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file) {
        if (validateFile(file)) {
          setSelectedFile(file);
          onChange(file);

          if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            if (internalPreviewUrl) URL.revokeObjectURL(internalPreviewUrl);
            setInternalPreviewUrl(url);
          } else {
            setInternalPreviewUrl(null);
          }
        }
      } else {
        setSelectedFile(null);
        onChange(null);
        if (internalPreviewUrl) URL.revokeObjectURL(internalPreviewUrl);
        setInternalPreviewUrl(null);
      }
    },
    [onChange, validateFile, internalPreviewUrl]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`fileupload-container ${className}`}>
      {label && <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>}

      <div
        className={`fileupload-dropzone ${isDragging ? "dragging" : ""} ${error || validationError ? "has-error" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          id={id}
        />

        <div className="fileupload-icon">
          <Upload size={24} />
        </div>

        <div className="fileupload-text">
          {selectedFile ? (
            <span className="truncate max-w-[200px] inline-block">{selectedFile.name}</span>
          ) : (
            "Click or drag file to upload"
          )}
        </div>
        <div className="fileupload-subtext">
          {accept === "image/*" ? "PNG, JPG, GIF up to " : "Files up to "}
          {maxSize}MB
        </div>

        {displayPreviewUrl && (
          <div className="fileupload-preview">
            <img src={displayPreviewUrl} alt="Preview" />
            <button type="button" className="fileupload-remove" onClick={handleRemove} title="Remove file">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {(error || validationError) && <div className="fileupload-error">{error || validationError}</div>}
    </div>
  );
}
