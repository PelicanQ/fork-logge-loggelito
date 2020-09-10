/* eslint-disable no-console */
type Level = 'ERROR' | 'NOTICE' | 'INFO' | 'DEBUG'
const levels: Record<Level, number> = { ERROR: 1, NOTICE: 2, INFO: 3, DEBUG: 4 }

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
  constructor(
    readonly args: {
      level: Level | number
      request?: Request
      additionalLogEntries?: Record<string, any>
    },
  ) {
    if (typeof args.level === 'string') {
      const level = levels[args.level]
      if (!level) {
        throw new Error(
          `invalid level: "${args.level}" given. Only ${Object.keys(levels).toString()} is valid`,
        )
      }
      this.level = level
    } else {
      this.level = args.level
    }
  }

  public error(args: { error?: Error; entry?: any }): void {
    if (!shouldLog(levels['ERROR'], this.level)) {
      return
    }
    const log: Record<string, any> = {
      severity: 'ERROR',
      stack: args?.error?.stack,
      error_message: args?.error?.message,
      ...args.entry,
    }
    addRequestTrace({ request: this.args.request, log })
    console.log(JSON.stringify(log))
  }

  public notice(args: { entry: any }): void {
    if (!shouldLog(levels['NOTICE'], this.level)) {
      return
    }
    const log: Record<string, any> = {
      severity: 'NOTICE',
      ...args.entry,
    }
    addRequestTrace({ request: this.args.request, log })
    console.log(JSON.stringify(log))
  }

  public info(args: { entry: any }): void {
    if (!shouldLog(levels['INFO'], this.level)) {
      return
    }
    const log: Record<string, any> = {
      severity: 'INFO',
      ...args.entry,
    }
    addRequestTrace({ request: this.args.request, log })
    console.log(JSON.stringify(log))
  }

  public debug(args: { entry: any }): void {
    if (!shouldLog(levels['DEBUG'], this.level)) {
      return
    }
    const log: Record<string, any> = {
      severity: 'DEBUG',
      ...args.entry,
    }
    addRequestTrace({ request: this.args.request, log })
    console.log(JSON.stringify(log))
  }
}
