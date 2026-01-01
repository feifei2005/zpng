# 一键压缩B站直播间表情 🎨

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> 自动将表情图片转换为B站直播间支持的PNG格式 | 尺寸：162×162px | 大小：≤16KB

## ✨ 主要功能

- 🖱️ **拖拽上传 / 点击选择图片**：简单直观的操作方式
- 📁 **支持多选和文件夹拖拽**：批量处理更高效
- 🎨 **支持多种格式**：PNG、JPG、GIF、WebP 等常见格式
- ⚡ **自动转换并压缩**：一键完成尺寸调整和压缩
- 👁️ **点击预览 / 一键下载全部**：方便查看和保存结果
- 🔒 **纯客户端处理**：所有处理均在浏览器完成，保护隐私安全

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI库** | [React 18](https://react.dev/) |
| **语言** | [TypeScript](https://www.typescriptlang.org/) |
| **样式** | [Tailwind CSS](https://tailwindcss.com/) |
| **图片压缩** | [UPNG.js](https://github.com/photopea/UPNG.js) |
| **图片处理** | Canvas API |
| **部署** | [EdgeOne Pages](https://edgeone.ai/) |

## 🔧 压缩算法

本项目采用纯客户端压缩方案：

- **PNG-8 格式**：输出带透明通道的 PNG-8 格式
- **扩散仿色算法**：使用 Floyd-Steinberg 仿色，保证画质
- **渐进式压缩**：从 256 色逐步降低至 32 色，确保文件大小 ≤16KB

### 压缩流程

1. 使用 Canvas API 将图片缩放至 162×162 像素
2. 使用 UPNG.js 进行 PNG-8 量化压缩
3. 自动调整色彩数量，确保满足大小限制

## 🌐 在线使用

**在线地址**：[https://zipng-8nfwzch8uj.edgeone.run](https://zipng-8nfwzch8uj.edgeone.run)

部署平台：EdgeOne Pages

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📄 开源协议

本项目采用 [GPL-3.0](LICENSE) 许可证开源。

---

<p align="center">
  Made with ❤️ for B站直播间主播们
</p>
