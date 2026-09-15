import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js CSR + SSR Demo",
  description: "同一页面混合 CSR 客户端组件与 SSR 服务端组件的演示",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Web Vitals 性能指标采集，不渲染 UI，挂载后自动生效 */}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
