import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
};

/**
 * Bundle 分析：运行 `npm run analyze` 时（ANALYZE=true）生效。
 * - analyzerMode: "static"  构建后在 .next/analyze/ 下生成静态 HTML 报告文件
 * - openAnalyzer: false     不自动打开浏览器（需要看时手动打开报告文件即可）
 * 平时 `npm run build` 完全不受影响。
 */
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "static",
  openAnalyzer: false,
})(nextConfig);
