/**
 * ServerInfo 的骨架屏（Suspense fallback）
 * - 服务端组件 fetch 数据期间，这部分静态 HTML 会先行流式下发
 * - 数据就绪后由真实内容原地替换，避免整页白屏
 */
export default function ServerInfoSkeleton() {
  return (
    <section className="animate-pulse rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-6 w-24 rounded bg-emerald-200 dark:bg-emerald-800" />
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          SSR
        </span>
      </div>

      <div className="mb-4 h-4 w-3/4 rounded bg-emerald-200 dark:bg-emerald-800" />

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white/70 p-4 dark:bg-emerald-900/40"
          >
            <div className="h-5 w-2/3 rounded bg-emerald-200 dark:bg-emerald-800" />
            <div className="mt-2 h-4 w-full rounded bg-emerald-100 dark:bg-emerald-900" />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-emerald-800/60 dark:text-emerald-200/60">
        文章数据加载中（服务端 fetch 进行中，页面其余部分已可交互）...
      </p>
    </section>
  );
}
