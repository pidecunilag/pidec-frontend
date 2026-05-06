"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { FileUp, Loader2, File, X } from "lucide-react";

import { useVerification } from "@/lib/hooks/use-verification";
import { extractApiError } from "@/lib/api/client";

import { Button } from "@/components/ui/button";

interface Step2UploadProps {
  onNext: () => void;
  isReupload?: boolean;
}

export function Step2Upload({ onNext, isReupload = false }: Step2UploadProps) {
  const { uploadDoc, reuploadDoc, isUploading } = useVerification();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 5MB.");
      } else if (error?.code === "file-invalid-type") {
        toast.error("Invalid file type. Only PDF, JPG, and PNG are accepted.");
      } else {
        toast.error("File upload failed. Please try again.");
      }
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      if (isReupload) {
        await reuploadDoc(selectedFile);
      } else {
        let unauthData = undefined;
        const storedData = localStorage.getItem("pidec_register_step1_form");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (parsed.email && parsed.matricNumber) {
            unauthData = { email: parsed.email, matricNumber: parsed.matricNumber };
          }
        }
        await uploadDoc(selectedFile, unauthData);
        // Clean up memory after successful upload
        if (storedData) localStorage.removeItem("pidec_register_step1_form");
      }
      onNext();
    } catch (error: any) {
      const apiError = extractApiError(error);
      toast.error(apiError.message || "Failed to upload document.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isReupload ? "Re-upload Document" : "Verify Identity"}
        </h1>
        <p className="text-muted-foreground text-lg">
          Please upload your Exam Docket or Course Registration Form to verify your student status.
        </p>
      </div>

      <div className="space-y-6">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
              flex flex-col items-center justify-center min-h-[250px]
              ${
                isDragActive
                  ? "border-brand bg-brand/5"
                  : "border-border hover:border-brand/50 hover:bg-muted/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="p-4 bg-muted rounded-full mb-4">
              <FileUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">
              Drag & drop your file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
              PDF, JPG, PNG up to 5MB
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-xl p-6 flex items-start gap-4 bg-muted/30">
            <div className="p-3 bg-brand/10 text-brand rounded-lg">
              <File className="h-8 w-8" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-foreground truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <Button
          onClick={handleUpload}
          className="w-full h-12 text-base font-semibold"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            "Submit Document"
          )}
        </Button>
      </div>
    </div>
  );
}
