'use client';

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Download, Trash2, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { ImageItem, ProcessingStatus } from '@/types';
import { cn } from '@/app/lib/utils';

interface ImageCardProps {
  image: ImageItem;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ImageCard({ image, onDownload, onDelete }: ImageCardProps) {
  const getStatusIcon = () => {
    switch (image.status) {
      case 'idle':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (image.status) {
      case 'idle':
        return '等待中';
      case 'processing':
        return '处理中...';
      case 'success':
        return '已完成';
      case 'error':
        return image.error || '处理失败';
    }
  };

  const getStatusColor = () => {
    switch (image.status) {
      case 'idle':
        return 'text-gray-600 dark:text-gray-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        {/* 左侧：原图预览 */}
        <div className="flex-shrink-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <img
              src={image.originalPreview}
              alt={image.name}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* 中间：文件信息和状态 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-gray-900 dark:text-gray-100">
                {image.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                原始大小: {formatFileSize(image.originalSize)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={cn('text-sm font-medium', getStatusColor())}>
                {getStatusText()}
              </span>
            </div>
          </div>

          {image.status === 'processing' && image.progress !== undefined && (
            <Progress value={image.progress} max={100} />
          )}
        </div>

        {/* 右侧：压缩后预览和操作按钮 */}
        {image.status === 'success' && image.compressedPreview && (
          <div className="flex flex-shrink-0 items-center gap-4">
            <div className="space-y-2">
              <div className="relative h-24 w-24 overflow-hidden rounded-md border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                <img
                  src={image.compressedPreview}
                  alt={`${image.name} (压缩后)`}
                  className="h-full w-full object-contain"
                />
              </div>
              {image.compressedSize && (
                <p className="text-center text-xs font-medium text-green-600 dark:text-green-400">
                  {formatFileSize(image.compressedSize)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="success"
                onClick={() => onDownload(image.id)}
              >
                <Download className="h-4 w-4" />
                下载
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 非成功状态的删除按钮 */}
        {image.status !== 'success' && (
          <div className="flex flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
