export const perfMonitor = {
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
    }
  },
  
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
      } catch (error) {
        // Ignore performance measurement errors
      }
    }
  }
}