"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { FileUp, Loader2, File, X } from "lucide-react";

import { useVerification } from "@/lib/hooks/use-verification";
import { extractApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/hooks/use-auth";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage";

import { Button } from "@/components/ui/button";

interface Step2UploadProps {
  onNext: () => void;
  isReupload?: boolean;
}

export function Step2Upload({ onNext, isReupload = false }: Step2UploadProps) {
  const { uploadDoc, reuploadDoc, isUploading } = useVerification();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationIdentity] = useLocalStorageState<{
    email: string;
    matricNumber: string;
  } | null>("pidec_verification_identity", null);

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
    maxSize: 5 * 1024 * 1024,
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
        } else if (verificationIdentity?.email && verificationIdentity?.matricNumber) {
          unauthData = verificationIdentity;
        } else if (user?.email && user?.matricNumber) {
          unauthData = { email: user.email, matricNumber: user.matricNumber };
        }
        await uploadDoc(selectedFile, unauthData);
      }
      onNext();
    } catch (error: any) {
      const apiError = extractApiError(error);
      toast.error(apiError.message || "Failed to upload document.");
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-cyan)]">
          Verification
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
          {isReupload ? "Re-upload Document" : "Verify Identity"}
        </h1>
        <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
          Upload your Exam Docket or Course Registration Form so we can verify
          your student status.
        </p>
      </div>

      <div className="space-y-6">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`
              flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-10 text-center transition-colors
              ${
                isDragActive
                  ? "border-[var(--brand-purple)] bg-[rgba(142,77,255,0.08)]"
                  : "border-[rgba(42,0,59,0.12)] bg-white/72 hover:border-[rgba(142,77,255,0.36)] hover:bg-[rgba(142,77,255,0.05)]"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="mb-4 rounded-full bg-[linear-gradient(135deg,rgba(142,77,255,0.14)_0%,rgba(18,183,234,0.14)_100%)] p-4">
              <FileUp className="h-8 w-8 text-[var(--brand-purple)]" />
            </div>
            <p className="mb-1 text-base font-medium text-foreground">
              Drag & drop your file here
            </p>
            <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
            <p className="rounded-full bg-[rgba(42,0,59,0.06)] px-3 py-1 text-xs text-muted-foreground">
              PDF, JPG, PNG up to 5MB
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-4 rounded-[1.75rem] border border-[rgba(42,0,59,0.1)] bg-white/78 p-6 shadow-[0_14px_32px_rgba(42,0,59,0.06)]">
            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(142,77,255,0.14)_0%,rgba(18,183,234,0.14)_100%)] p-3 text-[var(--brand-purple)]">
              <File className="h-8 w-8" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-foreground" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-[rgba(42,0,59,0.06)] hover:text-foreground"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <Button
          onClick={handleUpload}
          className="h-14 w-full rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] text-base font-semibold text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
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
