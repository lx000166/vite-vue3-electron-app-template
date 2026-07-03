/**
 * loadingStore — 全局加载指示器状态管理
 *
 * 支持并发计数：同一 type 多次 start 只需一次 done 消除。
 *
 * @example
 * const loading = useLoadingStore()
 * loading.start()              // hb 类型，无遮罩（计数 1）
 * loading.start('hi', true)    // hi 类型，有遮罩（独立计数 1）
 * loading.done()               // hb 计数 → 0 → hb 隐藏
 * loading.done('hi')           // hi 计数 → 0 → hi 隐藏 → 全部隐藏
 */
export const useLoading = defineStore('loading', () => {
  // ── 状态 ──
  const display = ref(false)
  const type = ref('hb')
  const mask = ref(false)

  /** 各 type 的并发计数 */
  const counts = ref<Record<string, number>>({})

  // ── 操作 ──

  /**
   * 显示加载（计数 +1）
   * @param t  加载条类型，默认 'hb'
   * @param m  是否显示遮罩，默认 false
   */
  function start(t: string = 'hb', m: boolean = false): void {
    counts.value[t] = (counts.value[t] || 0) + 1
    type.value = t
    mask.value = m
    display.value = true
  }

  /**
   * 结束加载（计数 -1，归零后隐藏）
   * @param t  加载条类型，默认 'hb'
   */
  function done(t: string = 'hb'): void {
    if (!counts.value[t]) return
    counts.value[t]--
    const total = Object.values(counts.value).reduce((a, b) => a + b, 0)
    if (total <= 0) {
      display.value = false
    }
  }

  return { display, type, mask, start, done }
})
