/**
 * 计数器点击逻辑模块 —— 按需加载（lazy chunk）
 *
 * 该模块不会打入首屏 JS bundle：
 * 通过动态 import() 引用，Turbopack/Webpack 会将其拆分为独立的 chunk，
 * 浏览器只在用户首次点击按钮时才发起请求下载并执行它。
 */

// 用于直观验证加载时机：首屏不会打印，首次点击按钮时才会出现在控制台
console.log("[counterLogic] JS 模块已加载（这条日志只在首次点击按钮后出现）");

export function increment(count: number): number {
  return count + 1;
}

export function decrement(count: number): number {
  return count - 1;
}
