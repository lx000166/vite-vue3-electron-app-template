/**
 * sleep — 异步延迟工具
 *
 * @param ms 延迟毫秒数，默认 100
 * @returns Promise，在指定毫秒后 resolve
 *
 * @example
 * await sleep(50)          // 暂停 50ms
 * await sleep()            // 暂停 100ms（默认）
 */
export function sleep(ms: number = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
