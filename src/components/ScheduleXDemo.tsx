"use client";

import dynamic from "next/dynamic";

/**
 * Schedule-X 日历演示（按需加载包装）
 * - next/dynamic + ssr:false：日历依赖浏览器 DOM，不参与服务端渲染
 * - 同时复用前面学到的代码分割：日历相关 JS 单独成 chunk，首屏不加载
 */
const ScheduleXDemoInner = dynamic(() => import("./ScheduleXDemoInner"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      <div className="h-10 rounded-lg bg-orange-200 dark:bg-orange-800" />
      <div className="h-96 rounded-xl bg-orange-100 dark:bg-orange-900" />
      <p className="text-xs text-orange-800/60 dark:text-orange-200/60">
        日历组件 chunk 加载中...
      </p>
    </div>
  ),
});

export default function ScheduleXDemo() {
  return (
    <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm dark:border-orange-900 dark:bg-orange-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
          Schedule-X 日历
        </h2>
        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
          v4.8.0 · 按需加载
        </span>
      </div>

      <p className="mb-4 text-sm text-orange-800/80 dark:text-orange-200/80">
        MIT 协议免费商用的现代日历组件，底层基于 Temporal API，支持日/周/月多视图切换、
        事件拖拽缩放、国际化（已设 zh-CN）和一键暗色模式。支持视图的完整功能请直接操作下方日历。
      </p>

      <ScheduleXDemoInner />
    </section>
  );
}
