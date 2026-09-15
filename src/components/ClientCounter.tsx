"use client";

import { useEffect, useState } from "react";

/**
 * CSR 组件（Client Component）
 * - 通过 "use client" 指令声明，在浏览器端渲染并 hydrate
 * - 可以使用 useState / useEffect / 事件处理等交互能力
 * - 首次加载后由浏览器接管，后续交互不再请求服务端
 */
export default function ClientCounter() {
  const [count, setCount] = useState(0);
  // 点击逻辑模块是否已加载（首次点击时才动态 import）
  const [logicLoaded, setLogicLoaded] = useState(false);
  // 挂载时间在 hydration 完成后才生成，避免服务端与客户端渲染结果不一致
  const [mountedAt, setMountedAt] = useState<string | null>(null);

  useEffect(() => {
    setMountedAt(new Date().toLocaleTimeString("zh-CN"));
  }, []);

  /**
   * 点击时才通过动态 import() 加载 ./counterLogic 模块。
   * 构建工具会把 counterLogic 拆成独立 chunk，首屏不加载，
   * 首次点击按钮时浏览器才发起请求下载这部分 JS。
   */
  const handleStep = async (op: "inc" | "dec") => {
    const logic = await import("./counterLogic");
    setLogicLoaded(true);
    setCount((c) => (op === "inc" ? logic.increment(c) : logic.decrement(c)));
  };

  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900 dark:bg-blue-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          客户端组件
        </h2>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
          CSR
        </span>
      </div>

      <p className="mb-4 text-sm text-blue-800/80 dark:text-blue-200/80">
        该组件带 <code>&quot;use client&quot;</code>，在浏览器中渲染。
        组件挂载时间（hydration 后由浏览器生成）：{mountedAt ?? "生成中..."}
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => handleStep("dec")}
          className="h-10 w-10 rounded-lg bg-blue-600 text-xl font-bold text-white transition hover:bg-blue-700 active:scale-95"
        >
          −
        </button>
        <span className="min-w-16 text-center text-3xl font-bold tabular-nums text-blue-900 dark:text-blue-50">
          {count}
        </span>
        <button
          onClick={() => handleStep("inc")}
          className="h-10 w-10 rounded-lg bg-blue-600 text-xl font-bold text-white transition hover:bg-blue-700 active:scale-95"
        >
          +
        </button>
      </div>

      <p className="mt-4 text-xs text-blue-800/60 dark:text-blue-200/60">
        计数状态完全在浏览器内存中维护，刷新页面后归零。
      </p>
      <p className="mt-1 text-xs text-blue-800/60 dark:text-blue-200/60">
        点击逻辑模块（counterLogic）：
        {logicLoaded ? "已按需加载 ✓" : "未加载（首次点击按钮时才下载该 JS chunk）"}
      </p>
    </section>
  );
}
