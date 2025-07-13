const isDev = import.meta.env.DEV

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: Error
}

class Logger {
  private logHistory: LogEntry[] = []
  private maxHistorySize = 100

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      error,
    }
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }

  debug(message: string, data?: any): void {
    const entry = this.createLogEntry('debug', message, data)
    this.addToHistory(entry)

    if (isDev) {
      console.debug(`[DEBUG] ${entry.timestamp}: ${message}`, data || '')
    }
  }

  info(message: string, data?: any): void {
    const entry = this.createLogEntry('info', message, data)
    this.addToHistory(entry)

    console.info(`[INFO] ${entry.timestamp}: ${message}`, data || '')
  }

  warn(message: string, data?: any): void {
    const entry = this.createLogEntry('warn', message, data)
    this.addToHistory(entry)

    console.warn(`[WARN] ${entry.timestamp}: ${message}`, data || '')
  }

  error(message: string, error?: Error, data?: any): void {
    const entry = this.createLogEntry('error', message, data, error)
    this.addToHistory(entry)

    console.error(`[ERROR] ${entry.timestamp}: ${message}`, error || '', data || '')
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory]
  }

  clearHistory(): void {
    this.logHistory = []
  }
}

export const logger = new Logger()
export type {LogLevel, LogEntry}
