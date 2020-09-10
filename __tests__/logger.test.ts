import { Logger } from '../lib/logger'
let consoleSpy: jest.SpyInstance

beforeAll(() => {
  consoleSpy = jest.spyOn(global.console, 'log').mockReturnValue()
})

afterEach(() => {
  consoleSpy.mockClear()
})

describe('Levels', () => {
  describe('when initialized with string', () => {
    describe('when level is OFF', () => {
      const logger = new Logger({ level: 'OFF' })
      it('should not log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
    })
    describe('when level is ERROR', () => {
      const logger = new Logger({ level: 'ERROR' })
      it('should log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should not log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
    })
    describe('when level is NOTICE', () => {
      const logger = new Logger({ level: 'NOTICE' })
      it('should log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should not log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
    })
    describe('when level is INFO', () => {
      const logger = new Logger({ level: 'INFO' })
      it('should log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should not log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
    })
    describe('when level is DEBUG', () => {
      const logger = new Logger({ level: 'DEBUG' })
      it('should log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
    })
  })

  describe('initialized with number', () => {
    describe('when initilized with 2', () => {
      const logger = new Logger({ level: 2 })
      it('should log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).toBeCalledTimes(1)
      })
      it('should not log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
    })

    describe('when initialized with 0', () => {
      const logger = new Logger({ level: 0 })
      it('should not log on error level', async () => {
        const error = new Error()
        logger.error({ error: error, entries: { message: 'nice' } })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on NOTICE level', async () => {
        logger.notice({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on INFO level', async () => {
        logger.info({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
      it('should not log on DEBUG level', async () => {
        logger.debug({ message: 'nice' })
        expect(consoleSpy).not.toBeCalled()
      })
    })
  })
})

describe('message', () => {
  const logger = new Logger({ level: 'INFO' })
  it('should log the logging when info is called', async () => {
    logger.info({ message: 'nice' })
    expect(consoleSpy).toBeCalledWith(JSON.stringify({ severity: 'INFO', message: 'nice' }))
  })
  it('should log error when error is called', async () => {
    const error = new Error('error')
    logger.error({ error: error, entries: { message: 'nice' } })
    const stack = JSON.parse(consoleSpy.mock.calls[0][0]).stack as string
    expect(stack).toBeTruthy()
    expect(consoleSpy).toBeCalledWith(
      JSON.stringify({ severity: 'ERROR', stack, error_message: 'error', message: 'nice' }),
    )
  })

  describe('when using child', () => {
    describe('when several layers of children are created', () => {
      const child1 = logger.child({ child1_message: 'hello from 1' })
      const child2 = child1.child({ child2_message: 'hello from 2' })
      const child3 = child2.child({ child3_message: 'hello from 3' })
      it('should not use the same ref', async () => {
        expect(logger).not.toBe(child1)
        expect(child1).not.toBe(child2)
        expect(child2).not.toBe(child3)
      })
      it('should log the messages and include the messages from their parents', async () => {
        logger.info({ message: 'hehe' })
        child1.info({ message: 'cool' })
        child2.info({ message: 'cool' })
        child3.info({ message: 'cool' })
        const expectedLogs = [
          JSON.stringify({ severity: 'INFO', message: 'cool', child1_message: 'hello from 1' }),
          JSON.stringify({
            severity: 'INFO',
            message: 'cool',
            child1_message: 'hello from 1',
            child2_message: 'hello from 2',
          }),
          JSON.stringify({
            severity: 'INFO',
            message: 'cool',
            child1_message: 'hello from 1',
            child2_message: 'hello from 2',
            child3_message: 'hello from 3',
          }),
        ]
        expect(consoleSpy).toBeCalledWith(JSON.stringify({ severity: 'INFO', message: 'hehe' }))
        expect(consoleSpy).toBeCalledWith(expectedLogs[0])
        expect(consoleSpy).toBeCalledWith(expectedLogs[1])
        expect(consoleSpy).toBeCalledWith(expectedLogs[2])
      })
    })
  })
})

describe('trace', () => {
  const logger = new Logger({
    level: 'INFO',
    traceOptions: { gcpProject: 'hehe123', request: { header: () => '1234' } },
  })
  const child1 = logger.child({ child1_message: 'hello from 1' })
  const child2 = child1.child({ child2_message: 'hello from 2' })
  const child3 = child2.child({ child3_message: 'hello from 3' })
  it('should persist the trace over children', async () => {
    logger.info({ message: 'cool' })
    child1.info({ message: 'cool' })
    child2.info({ message: 'cool' })
    child3.info({ message: 'cool' })
    const expectedLogs = [
      JSON.stringify({
        severity: 'INFO',
        message: 'cool',
        'logging.googleapis.com/trace': 'projects/hehe123/traces/1234',
        child1_message: 'hello from 1',
      }),
      JSON.stringify({
        severity: 'INFO',
        message: 'cool',
        'logging.googleapis.com/trace': 'projects/hehe123/traces/1234',
        child1_message: 'hello from 1',
        child2_message: 'hello from 2',
      }),
      JSON.stringify({
        severity: 'INFO',
        message: 'cool',
        'logging.googleapis.com/trace': 'projects/hehe123/traces/1234',
        child1_message: 'hello from 1',
        child2_message: 'hello from 2',
        child3_message: 'hello from 3',
      }),
    ]
    expect(consoleSpy).toBeCalledWith(
      JSON.stringify({
        severity: 'INFO',
        message: 'cool',
        'logging.googleapis.com/trace': 'projects/hehe123/traces/1234',
      }),
    )
    expect(consoleSpy).toBeCalledWith(expectedLogs[0])
    expect(consoleSpy).toBeCalledWith(expectedLogs[1])
    expect(consoleSpy).toBeCalledWith(expectedLogs[2])
  })
})
