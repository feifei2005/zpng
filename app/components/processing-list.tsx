'use client';

import { ImageCard } from './image-card';
import { Button } from './ui/button';
import { Download, Trash2 } from 'lucide-react';
import { ImageItem } from '@/types';

interface ProcessingListProps {
  images: ImageItem[];
  onDownload: (id: string) => void;
  onDownloadAll: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function ProcessingList({
  images,
  onDownload,
  onDownloadAll,
  onDelete,
  onClearAll,
}: ProcessingListProps) {
  if (images.length === 0) {
    return null;
  }

  const successCount = images.filter((img) => img.status === 'success').length;
  const processingCount = images.filter((img) => img.status === 'processing').length;
  const errorCount = images.filter((img) => img.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            共 <span className="font-semibold">{images.length}</span> 张图片
          </span>
          {successCount > 0 && (
            <span className="text-green-600 dark:text-green-400">
              ✓ {successCount} 成功
            </span>
          )}
          {processingCount > 0 && (
            <span className="text-blue-600 dark:text-blue-400">
              ⟳ {processingCount} 处理中
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-red-600 dark:text-red-400">
              ✗ {errorCount} 失败
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {successCount > 0 && (
            <Button
              variant="success"
              size="sm"
              onClick={onDownloadAll}
            >
              <Download className="h-4 w-4" />
              下载全部 ({successCount})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
          >
            <Trash2 className="h-4 w-4" />
            清空列表
          </Button>
        </div>
      </div>

      {/* 图片列表 */}
      <div className="space-y-3">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
