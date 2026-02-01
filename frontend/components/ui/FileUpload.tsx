"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Image, File } from "lucide-react";

interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    onFilesChange: (files: File[]) => void;
}

export default function FileUpload({
    accept = "*",
    multiple = false,
    maxSize = 10,
    onFilesChange,
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateAndAddFiles = useCallback(
        (newFiles: FileList) => {
            const validFiles: File[] = [];
            setError(null);

            Array.from(newFiles).forEach((file) => {
                if (file.size > maxSize * 1024 * 1024) {
                    setError(`File "${file.name}" exceeds ${maxSize}MB limit`);
                    return;
                }
                validFiles.push(file);
            });

            const updatedFiles = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1);
            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
        },
        [files, maxSize, multiple, onFilesChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
                validateAndAddFiles(e.dataTransfer.files);
            }
        },
        [validateAndAddFiles]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                validateAndAddFiles(e.target.files);
            }
        },
        [validateAndAddFiles]
    );

    const removeFile = useCallback(
        (index: number) => {
            const updatedFiles = files.filter((_, i) => i !== index);
            setFiles(updatedFiles);
            onFilesChange(updatedFiles);
        },
        [files, onFilesChange]
    );

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return <Image className="w-5 h-5 text-purple-500" />;
        if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-slate-500" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="space-y-3">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }
        `}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-indigo-100">
                        <Upload className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            Drop files here or click to upload
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Max file size: {maxSize}MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group"
                        >
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 text-slate-500 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
