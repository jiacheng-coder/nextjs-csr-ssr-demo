interface Post {
  id: number;
  title: string;
  body: string;
}

/**
 * SSR 组件（Server Component，动态渲染）
 * - 没有 "use client"，默认就是服务端组件
 * - fetch 使用 cache: "no-store"，每次请求都在服务端实时拉取数据（SSR 动态渲染）
 * - 文章列表在服务端渲染成 HTML 后直接下发，首屏即包含完整内容
 */
export default async function ServerInfo() {
  // 人为延迟 3 秒，模拟慢接口，用于演示 Suspense 流式渲染的效果：
  // 有 Suspense 时页面框架秒开、本组件位置先显示骨架屏；
  // 没有 Suspense 时整个页面会被这 3 秒阻塞（TTFB 变长、白屏）。
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5", {
    cache: "no-store", // 禁用缓存，保证每次请求都实时请求服务端数据
  });
  const articles: Post[] = await res.json();

  // 以下信息也在服务端生成，用于直观验证“每次请求都重新渲染”
  const serverTime = new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour12: false,
  });
  const requestId = crypto.randomUUID();

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-900 dark:bg-emerald-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
          服务端组件
        </h2>
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          SSR
        </span>
      </div>

      <p className="mb-4 text-sm text-emerald-800/80 dark:text-emerald-200/80">
        该组件是 async Server Component，每次请求时在服务端通过{" "}
        <code>fetch(..., &#123; cache: &quot;no-store&quot; &#125;)</code>{" "}
        实时拉取 jsonplaceholder 的文章数据并渲染成 HTML 下发。
      </p>

      <ul className="space-y-3">
        {articles.map((article) => (
          <li
            key={article.id}
            className="rounded-xl bg-white/70 p-4 dark:bg-emerald-900/40"
          >
            <h3 className="font-semibold capitalize text-emerald-900 dark:text-emerald-50">
              #{article.id} {article.title}
            </h3>
            <p className="mt-1 text-sm text-emerald-800/70 dark:text-emerald-200/70">
              {article.body.substring(0, 100)}...
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 border-t border-emerald-200 pt-3 text-xs text-emerald-800/60 dark:border-emerald-800 dark:text-emerald-200/60">
        <p>服务端渲染时间：{serverTime}</p>
        <p className="font-mono">本次请求 ID：{requestId}</p>
        <p>刷新页面：时间与请求 ID 每次都会变化（证明是逐请求动态渲染）。</p>
      </div>
    </section>
  );
}
