/* eslint-disable no-console */
type Level = 'OFF' | 'ERROR' | 'NOTICE' | 'INFO' | 'DEBUG'
const levels: Record<Level, number> = { OFF: 0, ERROR: 1, NOTICE: 2, INFO: 3, DEBUG: 4 }

interface Request {
  header(name: string): string
}

const shouldLog = (levelCalled: number, levelInitilized: number): boolean => {
  return levelCalled <= levelInitilized
}

const addRequestTrace = (args: { request?: Request; log: Record<string, any> }): void => {
  if (args.request) {
    const trace = (args.request.header('X-Cloud-Trace-Context') || '').split('/')
    if (trace) {
      args.log['logging.googleapis.com/trace'] = `projects/hallonpaj/traces/${trace}`
    }
  }
}

export class Logger {
  private level: number
  private additionalEntries?: Record<string, any>
  private request?: Request

  constructor(args: {
    level: Level | number
    request?: Request
    additionalLogEntries?: Record<string, any>
  }) {
    if (typeof args.level === 'string') {
      const level = levels[args.level]
      if (level == null) {
        throw new Error(
          `invalid level: "${args.level}" given. Only ${Object.keys(levels).toString()} is valid`,
        )
      }
      this.level = level
    } else {
      this.level = args.level
    }
    this.additionalEntries = args.additionalLogEntries
    this.request = args.request
  }

  public error(args: { error?: Error; entries?: Record<string, any> }): void {
    const entries: Record<string, any> = {
      stack: args?.error?.stack,
      error_message: args?.error?.message,
      ...args.entries,
    }
    this.log({ level: 'ERROR', entries })
  }

  public notice(entries: Record<string, any>): void {
    this.log({ level: 'NOTICE', entries: entries })
  }

  public info(entries: Record<string, any>): void {
    this.log({ level: 'INFO', entries: entries })
  }

  public debug(entries: Record<string, any>): void {
    this.log({ level: 'DEBUG', entries: entries })
  }

  public child(additionalEntries: Record<string, any>): Logger {
    return new Logger({
      level: this.level,
      additionalLogEntries: { ...this.additionalEntries, ...additionalEntries },
      request: this.request,
    })
  }

  private log(args: { entries: Record<string, any>; level: Level }): void {
    if (!shouldLog(levels[args.level], this.level)) {
      return
    }
    const log: Record<string, any> = {
      severity: args.level,
      ...args.entries,
      ...this.additionalEntries,
    }
    addRequestTrace({ request: this.request, log })
    console.log(JSON.stringify(log))
  }
}
