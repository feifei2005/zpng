# B站直播间表情一键压缩

快速压缩B站直播间表情包，支持批量处理。

## 技术栈

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图片处理**: Sharp, Imagemin-pngquant
- **部署**: EdgeOne Pages

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动边缘函数开发
npm run dev:functions

# 构建生产版本
npm run build
```

## 项目结构

```
.
├── app/                  # Next.js 应用目录
│   ├── components/       # React 组件
│   ├── lib/             # 工具函数
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 首页
├── node-functions/       # EdgeOne 边缘函数
│   └── compress/        # 图片压缩函数
├── public/              # 静态资源
├── types/               # TypeScript 类型定义
└── package.json         # 项目配置
```

## 功能特性

- ✅ 支持批量图片上传
- ✅ 实时压缩预览
- ✅ 自定义压缩参数
- ✅ 一键下载压缩结果
- ✅ 响应式设计

## License

MIT
