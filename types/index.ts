// 图片压缩相关类型定义
export interface CompressOptions {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressResult {
  success: boolean;
  originalSize: number;
  compressedSize: number;
  blob?: Blob;
  error?: string;
}

export interface ImageFile {
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  result?: CompressResult;
}

// 处理状态类型
export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

// 图片项类型
export interface ImageItem {
  id: string;
  name: string;
  originalSize: number;
  originalPreview: string;
  compressedSize?: number;
  compressedPreview?: string;
  compressedBlob?: Blob;
  status: ProcessingStatus;
  progress?: number;
  error?: string;
}
