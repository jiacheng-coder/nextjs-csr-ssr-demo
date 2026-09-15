"use client";

import {
  memo,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

/* ================= 实验数据与"昂贵计算" ================= */

interface Item {
  id: number;
  name: string;
  price: number;
}

const FRUITS = ["苹果", "香蕉", "橙子", "葡萄", "西瓜"];

/** 5000 条商品数据，模块级常量，不参与状态 */
const ALL_ITEMS: Item[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  name: `商品${i}号-${FRUITS[i % FRUITS.length]}`,
  price: ((i * 37) % 500) + 1,
}));

/** 人为制造的单条计算开销：模拟真实业务里的复杂计算/格式化 */
function busyWork() {
  let x = 0;
  for (let i = 0; i < 4000; i++) x += Math.sqrt(i);
  return x > 0; // 用掉 x，防止 JIT 把循环优化掉
}

/** 昂贵过滤：5000 条 × 单条开销 ≈ 上百毫秒 */
let filterRunCount = 0; // 记录昂贵过滤真实执行次数（useMemo 实验的关键证据）
function expensiveFilter(items: Item[], query: string) {
  filterRunCount++;
  const start = performance.now();
  const q = query.toLowerCase();
  const list = items.filter(
    (item) => busyWork() && item.name.toLowerCase().includes(q)
  );
  return { list, cost: performance.now() - start };
}

/** 昂贵排序：同样人为制造开销 */
function expensiveSort(items: Item[]) {
  const start = performance.now();
  const sorted = [...items].sort((a, b) => {
    busyWork();
    return a.price - b.price;
  });
  return { sorted, cost: performance.now() - start };
}

/* ========== React.memo 实验：两个一模一样的子组件，一个包 memo ========== */

/** 未优化：父组件每次渲染（每敲一个字符）它都跟着重渲染 */
function PlainSummary({ count }: { count: number }) {
  const renders = useRef(0);
  renders.current++;
  return (
    <span suppressHydrationWarning className="text-red-600 dark:text-red-400">
      普通子组件渲染 {renders.current} 次
    </span>
  );
}

/** 优化后：props(count) 不变时跳过渲染 */
const MemoSummary = memo(function MemoSummary({ count }: { count: number }) {
  const renders = useRef(0);
  renders.current++;
  return (
    <span suppressHydrationWarning className="text-green-600 dark:text-green-400">
      memo 子组件渲染 {renders.current} 次
    </span>
  );
});

/* ================= 主实验组件 ================= */

export default function RenderLab() {
  const [query, setQuery] = useState("");
  const [memoOn, setMemoOn] = useState(true);
  const [deferOn, setDeferOn] = useState(true);
  const [sorted, setSorted] = useState(false);

  // 本组件渲染次数（观察重渲染频率）
  const renders = useRef(0);
  renders.current++;

  /* --- useDeferredValue：必须无条件调用，用时再二选一 --- */
  const deferredQuery = useDeferredValue(query);
  const effectiveQuery = deferOn ? deferredQuery : query;
  const isStale = deferOn && deferredQuery !== query; // 列表内容落后于输入

  /* --- useMemo：缓存昂贵过滤结果；关闭时每次渲染都重新执行 --- */
  const memoized = useMemo(
    () => expensiveFilter(ALL_ITEMS, effectiveQuery),
    [effectiveQuery]
  );
  const { list, cost } = memoOn
    ? memoized
    : expensiveFilter(ALL_ITEMS, effectiveQuery);

  /* --- 昂贵排序发生在【渲染期】（useMemo 缓存）---
     这样 useTransition 才能发挥作用：按钮点击只改 sorted 状态，
     昂贵的排序渲染由 React 调度——紧急更新立刻执行，过渡更新在后台让路执行。 */
  const { displayList, sortCost } = useMemo(() => {
    if (!sorted) return { displayList: list, sortCost: 0 };
    const { sorted: s, cost: c } = expensiveSort(list);
    return { displayList: s, sortCost: c };
  }, [list, sorted]);

  /* --- useTransition：把昂贵的排序渲染标记为"非紧急" --- */
  const [isPending, startTransition] = useTransition();
  const handleSort = (useTransitionMode: boolean) => {
    if (useTransitionMode) {
      // 过渡更新：按钮反馈即时，排序渲染在后台进行，期间页面仍可交互
      startTransition(() => setSorted((v) => !v));
    } else {
      // 紧急更新：渲染同步执行，昂贵排序会卡住整个页面直到完成
      setSorted((v) => !v);
    }
  };

  return (
    <section className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm dark:border-purple-900 dark:bg-purple-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
          React 渲染优化实验室
        </h2>
        <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white">
          CSR · 5000 条数据
        </span>
      </div>

      <p className="mb-4 text-sm text-purple-800/80 dark:text-purple-200/80">
        在 5000 条商品中筛选（每条过滤都带人为昂贵计算）。试着关掉下面的开关，
        对比输入卡顿程度和执行次数的变化。
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入商品名筛选，如：苹果"
        className="mb-3 w-full rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm text-purple-900 outline-none focus:border-purple-500 dark:border-purple-700 dark:bg-purple-900 dark:text-purple-50"
      />

      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-purple-900 dark:text-purple-100">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={memoOn}
            onChange={(e) => setMemoOn(e.target.checked)}
            className="h-4 w-4 accent-purple-600"
          />
          useMemo 缓存过滤结果
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={deferOn}
            onChange={(e) => setDeferOn(e.target.checked)}
            className="h-4 w-4 accent-purple-600"
          />
          useDeferredValue 延迟列表更新
        </label>
      </div>

      {/*
        suppressHydrationWarning：以下统计数据天然在服务端/客户端不一致
        （耗时是 performance.now() 实测值、执行次数是模块级计数器、
        dev 下 StrictMode 还会让客户端渲染次数 ×2），
        属于合法差异，逐行 suppress 避免 hydration mismatch 报错。
      */}
      <div className="mb-3 space-y-1 rounded-xl bg-white/70 p-3 font-mono text-xs text-purple-900 dark:bg-purple-900/40 dark:text-purple-100">
        <p suppressHydrationWarning>主组件渲染次数：{renders.current}</p>
        <p suppressHydrationWarning>
          昂贵过滤实际执行次数：{filterRunCount}
          <span className="ml-2 text-purple-500">
            （关 useMemo 后点任意开关，看它每次都 +1）
          </span>
        </p>
        <p suppressHydrationWarning>本次过滤耗时：{cost.toFixed(1)}ms</p>
        <p suppressHydrationWarning>
          匹配 {list.length} 条{isStale && "（列表更新中...）"}
          {sorted && ` ｜ 排序耗时：${sortCost.toFixed(1)}ms`}
        </p>
        <p suppressHydrationWarning className="flex gap-4">
          <PlainSummary count={list.length} />
          <MemoSummary count={list.length} />
        </p>
      </div>

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => handleSort(false)}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95"
        >
          价格排序（直接更新，会卡）
        </button>
        <button
          onClick={() => handleSort(true)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 active:scale-95"
        >
          {isPending ? "排序中（页面仍可交互）..." : "价格排序（startTransition）"}
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-2 text-xs text-purple-800 dark:text-purple-200 sm:grid-cols-4">
        {displayList.slice(0, 8).map((item) => (
          <li
            key={item.id}
            className="rounded-lg bg-white/70 px-3 py-2 dark:bg-purple-900/40"
          >
            {item.name}
            <span className="ml-1 text-purple-500">¥{item.price}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-purple-800/60 dark:text-purple-200/60">
        仅预览前 8 条；完整实验请配合 React DevTools Profiler 观察各组件渲染次数。
      </p>
    </section>
  );
}
