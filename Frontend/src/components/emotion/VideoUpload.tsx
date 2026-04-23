import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const VideoUpload = ({ file, onFileChange }: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const f = files[0];
      if (f.type === "video/mp4" || f.name.toLowerCase().endsWith(".mp4")) {
        onFileChange(f);
      }
    },
    [onFileChange]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">Video file</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-smooth",
          "hover:border-primary/60 hover:bg-primary/5",
          isDragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-border bg-secondary/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,.mp4"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {file ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-gradient-primary p-2.5 rounded-xl shrink-0">
                <FileVideo className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="rounded-full shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="bg-gradient-primary p-4 rounded-2xl shadow-glow"
            >
              <UploadCloud className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div>
              <p className="font-medium">Drag & drop your video here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse — MP4 only
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-2"
            >
              Upload Video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
