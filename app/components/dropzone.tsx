'use client';

import { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function Dropzone({ onFilesSelected }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        onFilesSelected(files);
      }

      // Reset input value to allow selecting the same files again
      e.target.value = '';
    },
    [onFilesSelected]
  );

  const handleClick = () => {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative cursor-pointer rounded-lg border-2 border-dashed p-12 transition-all',
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/10'
      )}
    >
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={cn(
          'rounded-full p-4 transition-colors',
          isDragging
            ? 'bg-blue-100 dark:bg-blue-900/30'
            : 'bg-gray-200 dark:bg-gray-700'
        )}>
          {isDragging ? (
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          ) : (
            <ImageIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          )}
        </div>

        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {isDragging ? '放开以上传图片' : '点击上传或拖拽图片到此处'}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            支持 PNG、JPG、GIF、WebP 等格式
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            将自动压缩为 162×162px 的 PNG 格式（≤16KB）
          </p>
        </div>
      </div>
    </div>
  );
}
