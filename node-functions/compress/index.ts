import sharp from 'sharp';
import { execFile } from 'child_process';
// @ts-ignore - pngquant-bin 没有类型定义
import pngquant from 'pngquant-bin';
import util from 'util';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const execFilePromise = util.promisify(execFile);

// 定义压缩配置
interface CompressionConfig {
  colors: number;
  quality: string;
  speed: number;
}

// 压缩配置数组，按优先级排列
const COMPRESSION_CONFIGS: CompressionConfig[] = [
  { colors: 256, quality: '90-100', speed: 1 },
  { colors: 192, quality: '85-95', speed: 1 },
  { colors: 128, quality: '80-90', speed: 1 },
  { colors: 96, quality: '75-85', speed: 1 },
  { colors: 64, quality: '70-80', speed: 1 },
  { colors: 32, quality: '65-75', speed: 1 },
];

const MAX_FILE_SIZE = 15.5 * 1024; // 15.5KB，留余量

export async function onRequest(context: any) {
  const { request } = context;
  
  let tempInputPath: string | null = null;
  let tempOutputPath: string | null = null;

  try {
    // 检查请求方法
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: '只支持 POST 请求' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: '未找到上传的文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 记录原始文件大小
    const originalSize = file.size;
    const originalName = file.name;

    // 读取文件 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Step 1: Sharp 预处理
    // Resize 到 162x162，保持纵横比，透明背景
    const preprocessedBuffer = await sharp(inputBuffer)
      .resize(162, 162, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    // 创建临时文件路径
    const tempDir = os.tmpdir();
    tempInputPath = path.join(tempDir, `input-${Date.now()}.png`);
    tempOutputPath = path.join(tempDir, `output-${Date.now()}.png`);

    // 写入临时输入文件
    await fs.writeFile(tempInputPath, preprocessedBuffer);

    // Step 2: Pngquant 压缩循环
    let compressedBuffer: Buffer | null = null;
    let finalConfig: CompressionConfig | null = null;

    for (const config of COMPRESSION_CONFIGS) {
      try {
        // 构建 pngquant 参数
        const args = [
          '--force',
          '--quality', config.quality,
          '--speed', String(config.speed),
          '--floyd', '1',
          String(config.colors),
          '--output', tempOutputPath,
          tempInputPath,
        ];

        // 执行 pngquant
        await execFilePromise(pngquant, args);

        // 读取压缩后的文件
        const resultBuffer = await fs.readFile(tempOutputPath);
        const resultSize = resultBuffer.length;

        // 检查文件大小
        if (resultSize <= MAX_FILE_SIZE) {
          compressedBuffer = resultBuffer;
          finalConfig = config;
          break;
        }

        // 如果文件仍然过大，继续下一个配置
        // 删除临时输出文件以便下次尝试
        await fs.unlink(tempOutputPath).catch(() => {});
      } catch (error) {
        // 如果这个配置失败，继续尝试下一个
        console.error(`压缩配置失败: ${config.colors} 色`, error);
        continue;
      }
    }

    // 如果所有配置都失败，返回错误
    if (!compressedBuffer) {
      return new Response(
        JSON.stringify({ 
          error: '无法将图片压缩到 16KB 以下，请尝试更简单的图片' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 计算压缩后的大小
    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    // 转换为 Base64
    const base64Data = compressedBuffer.toString('base64');

    // 返回成功响应
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          base64: base64Data,
          originalSize,
          compressedSize,
          compressionRatio: `${compressionRatio}%`,
          fileName: originalName,
          config: finalConfig,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('压缩过程出错:', error);
    return new Response(
      JSON.stringify({ 
        error: '压缩失败',
        details: error instanceof Error ? error.message : '未知错误'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    // 清理临时文件
    if (tempInputPath) {
      await fs.unlink(tempInputPath).catch(() => {});
    }
    if (tempOutputPath) {
      await fs.unlink(tempOutputPath).catch(() => {});
    }
  }
}
