import { Suspense } from "react";
import ClientCounter from "@/components/ClientCounter";
import RenderLab from "@/components/RenderLab";
import ScheduleXDemo from "@/components/ScheduleXDemo";
import ServerInfo from "@/components/ServerInfo";
import ServerInfoSkeleton from "@/components/ServerInfoSkeleton";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Next.js 渲染方式对比 Demo
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          同一页面中混合两种渲染方式：下方蓝色卡片是 CSR 客户端组件，
          绿色卡片是 SSR 服务端组件（每次请求动态渲染，经 Suspense
          流式下发，数据就绪前显示骨架屏）。
        </p>
      </header>

      {/*
        Streaming SSR：服务端先流式下发页面框架 + 骨架屏（TTFB 很短），
        ServerInfo 的数据 fetch 完成后再把真实内容流式推送到浏览器原地替换。
        对比实验：去掉 Suspense 直接 <ServerInfo />，整页会被 3 秒延迟阻塞。
      */}
      <Suspense fallback={<ServerInfoSkeleton />}>
        <ServerInfo />
      </Suspense>
      <ClientCounter />
      <RenderLab />
      <ScheduleXDemo />
    </main>
  );
}
