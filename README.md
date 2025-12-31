# 一键压缩B站直播间表情 🎨

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> 自动将您的表情转换为B站直播间支持的PNG格式 | 尺寸：162×162px | 大小：≤16KB

## ✨ 功能特性

- 🖼️ **智能压缩**：自动将图片压缩到16KB以下，同时保持最佳画质
- 📐 **尺寸调整**：自动裁剪/缩放到162×162像素
- 🎨 **格式转换**：输出PNG-8格式，支持透明背景
- 🖱️ **拖拽上传**：支持拖拽单个/多个图片，甚至整个文件夹
- 📦 **批量处理**：一次处理多张表情，批量下载
- 🔒 **隐私安全**：所有处理均在服务端完成，不会上传到第三方

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js 15](https://nextjs.org/) (App Router) |
| **语言** | [TypeScript](https://www.typescriptlang.org/) |
| **样式** | [Tailwind CSS V4](https://tailwindcss.com/) |
| **图标** | [Lucide React](https://lucide.dev/) |
| **图像处理** | [Sharp](https://sharp.pixelplumbing.com/) + [Pngquant](https://pngquant.org/) |
| **部署** | [EdgeOne Pages](https://edgeone.ai/) |

## 📦 安装

```bash
# 克隆仓库
git clone https://github.com/feifei2005/zpng.git

# 进入项目目录
cd zpng

# 安装依赖
npm install
```

## 🚀 使用

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 启动后端函数开发服务器（需要 EdgeOne CLI）
npm run dev:functions
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
npm run build
npm run start
```

## 📁 项目结构

```
zpng/
├── app/                          # Next.js App Router
│   ├── components/               # React 组件
│   │   ├── ui/                   # 通用 UI 组件
│   │   │   ├── button.tsx        # 按钮组件
│   │   │   ├── card.tsx          # 卡片组件
│   │   │   └── progress.tsx      # 进度条组件
│   │   ├── dropzone.tsx          # 文件上传区
│   │   ├── image-card.tsx        # 图片卡片
│   │   └── processing-list.tsx   # 处理列表
│   ├── lib/                      # 工具函数
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── node-functions/               # EdgeOne Node Functions
│   └── compress/
│       └── index.ts              # 图像压缩 API
├── types/                        # TypeScript 类型定义
├── public/                       # 静态资源
└── ...配置文件
```

## 🔧 压缩算法

本项目使用 **Pngquant** 进行智能 PNG-8 量化压缩：

1. **预处理**：使用 Sharp 将图片 resize 到 162×162 像素（contain 模式，透明背景）
2. **量化压缩**：使用 Pngquant 进行有损压缩
3. **自适应调整**：从高质量配置开始，逐步降低直到满足 16KB 限制

### 压缩配置梯度

| 配置 | 颜色数 | 质量范围 |
|------|--------|----------|
| 1    | 256    | 90-100   |
| 2    | 192    | 85-95    |
| 3    | 128    | 80-90    |
| 4    | 96     | 75-85    |
| 5    | 64     | 70-80    |
| 6    | 32     | 65-75    |

算法会自动选择能满足大小限制的最高质量配置。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓��
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 开源协议

本项目采用 [GPL-3.0](LICENSE) 许可证开源。

这意味着：
- ✅ 可以自由使用、修改和分发
- ✅ 可以用于商业目的
- ⚠️ 修改后的代码必须开源
- ⚠️ 必须使用相同的 GPL-3.0 协议
- ⚠️ 必须注明原作者

## 🙏 致谢

- [Sharp](https://sharp.pixelplumbing.com/) - 高性能 Node.js 图像处理库
- [Pngquant](https://pngquant.org/) - PNG 压缩工具
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库

---

<p align="center">
  Made with ❤️ for B站直播间主播们
</p>
