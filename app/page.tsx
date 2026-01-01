'use client';

import { useState, useCallback } from 'react';
import { Dropzone } from './components/dropzone';
import { ProcessingList } from './components/processing-list';
import { ImageItem } from '@/types';
import { Sparkles, Github, Star } from 'lucide-react';
import { compressImage } from './lib/compress';

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

  // 图片处理函数 - 使用客户端 UPNG.js 压缩
  const processImage = async (id: string, file: File) => {
    // 设置为处理中状态
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, status: 'processing' as const, progress: 10 } : img
      )
    );

    try {
      // 使用客户端压缩函数
      const result = await compressImage(file, (progress) => {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, progress } : img))
        );
      });

      // 更新状态为成功
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                status: 'success' as const,
                compressedPreview: result.dataUrl,
                compressedSize: result.size,
                compressedBlob: result.blob,
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
          {/* 第一行：版权信息 + 隐私说明 */}
          <p>© 2024 B站直播间表情压缩工具 | 所有处理均在本地完成，保护您的隐私</p>
          
          {/* 第二行：GitHub Star 引导 */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <a
              href="https://github.com/feifei2005/zpng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Github className="h-4 w-4" />
              <span>如果觉得好用，欢迎给个</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </a>
          </div>
          
          {/* 第三行：Powered by EdgeOne + ICP 备案号 */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Powered by</span>
              <img
                src="https://edgeone.cloud.tencent.com/_next/static/media/headLogo.daeb48ad.png"
                alt="Tencent EdgeOne"
                className="h-6"
              />
            </div>
            <span className="hidden text-gray-300 dark:text-gray-600 sm:inline">|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              桂ICP备2024047917号-1
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
