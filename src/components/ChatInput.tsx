"use client";

import { Plus, Send, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useModelStore } from "@/store/useModelStore";

interface ChatInputProps {
  onSubmit?: (content: string, files: FileList | null) => void;
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const { model } = useModelStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { input_modalities } = model || {};

  useEffect(() => {
    if (fileInputRef.current?.files) {
      setFiles(fileInputRef.current.files);
    }
  }, [fileInputRef.current?.files]);

  const removeFile = (indexToRemove: number) => {
    if (files) {
      const dt = new DataTransfer();
      Array.from(files).forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file);
        }
      });
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
        setFiles(dt.files);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-xl px-2">
      <Card className="gap-2 rounded-3xl py-3">
        <CardContent className="px-3">
          <textarea
            placeholder="Ask anything"
            className="w-full resize-none focus:outline-0"
            onInput={(e) => setContent(e.currentTarget.value)}
            value={content}
          />
        </CardContent>
        <CardFooter className="flex-col px-3">
          {files && files.length > 0 && (
            <div className="mb-2 w-full space-y-2">
              {Array.from(files).map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-start justify-between rounded-xl border bg-gray-50 p-2 sm:items-center sm:p-3"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-5 w-5 flex-shrink-0 p-0 hover:bg-gray-200 sm:ml-2 sm:h-6 sm:w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              variant="outline"
              className="rounded-3xl px-3 text-xs sm:px-4 sm:text-sm"
              disabled={input_modalities?.length === 1}
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="ml-1 sm:ml-2">Upload files</span>
            </Button>
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={(e) => setFiles(e.target.files)}
            />
            <Button
              onClick={() => onSubmit?.(content, files)}
              size="icon"
              className="h-8 w-8 flex-shrink-0 rounded-full sm:h-10 sm:w-10"
              disabled={!content.trim() && (!files || files.length === 0)}
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
