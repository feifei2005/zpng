'use client';

import UPNG from 'upng-js';

// 压缩配置 - 从高质量到低质量
const COMPRESSION_CONFIGS = [
  { colors: 256 },  // 最高质量
  { colors: 192 },
  { colors: 128 },
  { colors: 96 },
  { colors: 64 },
  { colors: 48 },
  { colors: 32 },   // 最小体积
];

const TARGET_SIZE = 162;
const MAX_FILE_SIZE = 15.5 * 1024; // 15.5KB，留余量

export interface CompressResult {
  blob: Blob;
  size: number;
  dataUrl: string;
}

/**
 * 将图片文件加载为 HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('无法加载图片'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 使用 Canvas 将图片 resize 到目标尺寸
 * 保持纵横比，透明背景居中
 */
function resizeImage(img: HTMLImageElement, targetSize: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d')!;

  // 清空画布（透明背景）
  ctx.clearRect(0, 0, targetSize, targetSize);

  // 计算缩放比例，保持纵横比
  const scale = Math.min(targetSize / img.width, targetSize / img.height);
  const newWidth = Math.round(img.width * scale);
  const newHeight = Math.round(img.height * scale);

  // 居中绘制
  const x = Math.round((targetSize - newWidth) / 2);
  const y = Math.round((targetSize - newHeight) / 2);

  ctx.drawImage(img, x, y, newWidth, newHeight);

  return ctx.getImageData(0, 0, targetSize, targetSize);
}

/**
 * 将 ImageData 转换为 RGBA8 ArrayBuffer
 */
function imageDataToRGBA8(imageData: ImageData): ArrayBuffer {
  return imageData.data.buffer.slice(
    imageData.data.byteOffset,
    imageData.data.byteOffset + imageData.data.byteLength
  );
}

/**
 * 使用 UPNG.js 进行 PNG 量化压缩
 */
function compressWithUPNG(rgba8: ArrayBuffer, width: number, height: number, colors: number): ArrayBuffer {
  return UPNG.encode([rgba8], width, height, colors);
}

/**
 * 将 ArrayBuffer 转换为 Blob
 */
function arrayBufferToBlob(buffer: ArrayBuffer, mimeType: string = 'image/png'): Blob {
  return new Blob([buffer], { type: mimeType });
}

/**
 * 将 ArrayBuffer 转换为 Data URL
 */
function arrayBufferToDataUrl(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:image/png;base64,${btoa(binary)}`;
}

/**
 * 主压缩函数
 * 将图片压缩到 162x162，16KB 以下的 PNG-8 格式
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CompressResult> {
  // 加载图片
  onProgress?.(10);
  const img = await loadImage(file);

  // 释放 Object URL
  URL.revokeObjectURL(img.src);

  // Resize 到目标尺寸
  onProgress?.(30);
  const imageData = resizeImage(img, TARGET_SIZE);
  const rgba8 = imageDataToRGBA8(imageData);

  // 尝试不同的压缩配置
  onProgress?.(50);
  let compressedBuffer: ArrayBuffer | null = null;
  let usedColors = 256;

  for (const config of COMPRESSION_CONFIGS) {
    const buffer = compressWithUPNG(rgba8, TARGET_SIZE, TARGET_SIZE, config.colors);
    
    if (buffer.byteLength <= MAX_FILE_SIZE) {
      compressedBuffer = buffer;
      usedColors = config.colors;
      break;
    }
    
    // 即使超过大小限制，也保存最后一次结果
    compressedBuffer = buffer;
    usedColors = config.colors;
  }

  onProgress?.(80);

  // 如果即使最低质量也超过限制，仍然返回结果（用户可以看到大小）
  if (!compressedBuffer) {
    throw new Error('压缩失败');
  }

  // 检查最终大小
  if (compressedBuffer.byteLength > MAX_FILE_SIZE) {
    console.warn(`警告：压缩后仍超过 16KB 限制 (${(compressedBuffer.byteLength / 1024).toFixed(2)}KB, ${usedColors} 色)`);
  }

  onProgress?.(90);

  const blob = arrayBufferToBlob(compressedBuffer);
  const dataUrl = arrayBufferToDataUrl(compressedBuffer);

  onProgress?.(100);

  return {
    blob,
    size: compressedBuffer.byteLength,
    dataUrl,
  };
}
