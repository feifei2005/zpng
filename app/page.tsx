'use client';

import { useState, useCallback } from 'react';
import { Dropzone } from './components/dropzone';
import { ProcessingList } from './components/processing-list';
import { ImageItem } from '@/types';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);

  // 处理文件选择
  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newImages: ImageItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      originalSize: file.size,
      originalPreview: URL.createObjectURL(file),
      status: 'idle' as const,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // 开始处理每个图片
    for (const image of newImages) {
      processImage(image.id, files[newImages.indexOf(image)]);
    }
  }, []);

  // Base64 转 Blob 的辅助函数
  const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // 图片处理函数 - 调用真实的压缩 API
  const processImage = async (id: string, file: File) => {
    // 设置为处理中状态
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, status: 'processing' as const, progress: 10 } : img
      )
    );

    try {
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', file);

      // 更新进度
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, progress: 30 } : img))
      );

      // 调用压缩 API
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      // 更新进度
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, progress: 70 } : img))
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || '压缩失败');
      }

      // 更新进度
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, progress: 90 } : img))
      );

      // 处理返回的数据
      const { base64, compressedSize } = result.data;
      
      // 添加 data URI 前缀
      const compressedPreview = `data:image/png;base64,${base64}`;
      
      // 将 base64 转换为 Blob 以便下载
      const compressedBlob = base64ToBlob(base64);

      // 更新状态为成功
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                status: 'success' as const,
                compressedPreview,
                compressedSize,
                compressedBlob,
                progress: 100,
              }
            : img
        )
      );
    } catch (error) {
      console.error('压缩失败:', error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                status: 'error' as const,
                error: error instanceof Error ? error.message : '压缩失败，请重试',
              }
            : img
        )
      );
    }
  };

  // 下载单个图片
  const handleDownload = useCallback((id: string) => {
    const image = images.find((img) => img.id === id);
    if (!image || !image.compressedBlob) return;

    const url = URL.createObjectURL(image.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${image.name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [images]);

  // 下载全部成功的图片
  const handleDownloadAll = useCallback(() => {
    const successImages = images.filter((img) => img.status === 'success');
    successImages.forEach((image) => {
      handleDownload(image.id);
    });
  }, [images, handleDownload]);

  // 删除单个图片
  const handleDelete = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        // 清理 URL 对象
        if (image.originalPreview) URL.revokeObjectURL(image.originalPreview);
        if (image.compressedPreview) URL.revokeObjectURL(image.compressedPreview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  // 清空全部
  const handleClearAll = useCallback(() => {
    // 清理所有 URL 对象
    images.forEach((image) => {
      if (image.originalPreview) URL.revokeObjectURL(image.originalPreview);
      if (image.compressedPreview) URL.revokeObjectURL(image.compressedPreview);
    });
    setImages([]);
  }, [images]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
              一键压缩B站直播间表情
            </h1>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            自动将您的表情转换为B站支持的PNG格式
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            尺寸：162×162px | 大小：≤16KB
          </p>
        </div>

        {/* Dropzone */}
        <div className="mb-8">
          <Dropzone onFilesSelected={handleFilesSelected} />
        </div>

        {/* Processing List */}
        <ProcessingList
          images={images}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
          <p>© 2024 B站直播间表情压缩工具 | 所有处理均在本地完成，保护您的隐私</p>
        </footer>
      </div>
    </main>
  );
}
