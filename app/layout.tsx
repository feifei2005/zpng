import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B站直播间表情一键压缩",
  description: "快速压缩B站直播间表情包，支持批量处理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
