"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Web Vitals 性能指标上报组件
 *
 * Next.js 内置的 useReportWebVitals 会在浏览器真实渲染/交互过程中
 * 自动采集以下指标并回调：
 *
 * 核心指标（Core Web Vitals，Google 用于搜索排名）：
 * - LCP  (Largest Contentful Paint) 最大内容绘制时间，衡量加载速度，好 ≤ 2.5s
 * - CLS  (Cumulative Layout Shift) 累计布局偏移，衡量视觉稳定性，好 ≤ 0.1
 * - INP  (Interaction to Next Paint) 交互到下次绘制，衡量响应速度，好 ≤ 200ms
 *
 * 辅助指标：
 * - FCP  (First Contentful Paint) 首次内容绘制，好 ≤ 1.8s
 * - TTFB (Time to First Byte) 服务端首字节时间，好 ≤ 0.8s
 *
 * Next.js 特有指标：
 * - Next.js-hydration          页面 hydration 耗时
 * - Next.js-route-change-to-render 路由切换到渲染完成耗时
 * - Next.js-render             服务端渲染耗时
 *
 * metric.rating 会直接给出评级："good" | "needs-improvement" | "poor"
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const unit = metric.name === "CLS" ? "" : "ms";
    // 开发/学习阶段：直接打印到控制台（DevTools Console 可见）
    console.log(
      `[Web Vitals] ${metric.name} = ${Math.round(metric.value * 100) / 100}${unit}` +
        `（评级: ${metric.rating}）`
    );

    // 生产环境做法：把 metric 上报到自己的分析服务，例如：
    // navigator.sendBeacon("/api/vitals", JSON.stringify(metric));
    // 或接入第三方：Vercel Analytics、Sentry、Google Analytics 等
  });

  // 纯逻辑组件，不渲染任何 UI
  return null;
}
