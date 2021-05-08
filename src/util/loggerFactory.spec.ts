import { Request } from 'express';
import loggerFactory, { Logger, LogObject } from './loggerFactory';
import Bunyan from 'bunyan';

const mockInfo: jest.Mock<void> = jest.fn();
const mockError: jest.Mock<void> = jest.fn();
const mockDebug: jest.Mock<void> = jest.fn();
const mockCreateLogger = (): Bunyan => ({
	info: (input: Record<string, never>) => mockInfo(input),
	error: (input: Record<string, never>) => mockError(input),
	debug: (input: Record<string, never>) => mockDebug(input)
}) as unknown as Bunyan;
jest.mock('bunyan', () => ({
	createLogger: () => mockCreateLogger(),
	esModule: true
}))

describe('Logger', () => {
	describe('_addExtraRequestInfo', () => {
		it('adds request details to the logObject', () => {
			const logObject: LogObject = {
				a: 'a'
			}
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			const output: LogObject = logger._addExtraRequestInfo(logObject);

			expect(output).toEqual({
				url: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' },
				a: 'a'
			})
		})
	})
	describe('_getErrorLogObject', () => {
		it('dissects the Error object so that it can be logged', () => {
			const error: Error = { message: 'oops!', stack: 'Error: oops!\n    at test.ts:1:1\n' } as unknown as Error;
			expect(Logger._getErrorLogObject(error)).toMatchSnapshot();
		})
		it('can handle when the stack is missing', () => {
			const error: Error = { message: 'oops!' } as unknown as Error;
			expect(Logger._getErrorLogObject(error)).toMatchSnapshot();
		})
	})
	describe('_logByMethod', () => {
		// beforeEach(() => {
		// 	mockInfo.mockReset();
		// 	mockDebug.mockReset();
		// 	mockError.mockReset();
		// })
		it('logs errors', () => {
			const error: Error = {
				message: 'oops!',
				stack: 'Error: oops!\n    at test.ts:1:1\n',
				constructor: Error
			} as unknown as Error;
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger._logByMethod('info', error);

			expect(mockInfo).toHaveBeenCalledWith({
				message: 'oops!',
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				src: 'Error: oops!     at test.ts:1:1',
				url: '/test'
			});
		})
		it('logs errors with additional logObject', () => {
			const error: Error = {
				message: 'oops!',
				stack: 'Error: oops!\n    at test.ts:1:1\n',
				constructor: Error
			} as unknown as Error;
			const logObject: LogObject = { a: 'a' };
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger._logByMethod('info', error, logObject);

			expect(mockInfo).toHaveBeenCalledWith({
				message: 'oops!',
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				src: 'Error: oops!     at test.ts:1:1',
				url: '/test'
			});
		})
		it('logs error without stack', () => {
			const error: Error = {
				message: 'oops!',
				constructor: Error
			} as unknown as Error;
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger._logByMethod('info', error);

			expect(mockInfo).toHaveBeenCalledWith({
				message: 'oops!',
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				src: '',
				url: '/test'
			});
		})
		it('logs error with empty stack', () => {
			const error: Error = {
				message: 'oops!',
				stack: '',
				constructor: Error
			} as unknown as Error;
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger._logByMethod('info', error);

			expect(mockInfo).toHaveBeenCalledWith({
				message: 'oops!',
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				src: '',
				url: '/test'
			});
		})
		it('logs logObject', () => {
			const logObject: LogObject = { a: 'a' }
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger._logByMethod('info', logObject);

			expect(mockInfo).toHaveBeenCalledWith({
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				a: 'a',
				url: '/test'
			});
		})
	})
	describe('info', () => {
		it('logs via info', () => {
			const logObject: LogObject = { a: 'a' }
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger.info(logObject);

			expect(mockInfo).toHaveBeenCalledWith({
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				a: 'a',
				url: '/test'
			});
		})
	})
	describe('debug', () => {
		it('logs via debug', () => {
			const logObject: LogObject = { a: 'a' }
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger.debug(logObject);

			expect(mockDebug).toHaveBeenCalledWith({
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				a: 'a',
				url: '/test'
			});
		})
	})
	describe('error', () => {
		it('logs via error', () => {
			const logObject: LogObject = { a: 'a' }
			const req: Request = {
				originalUrl: '/test',
				method: 'GET',
				params: { p1: 'p1' },
				query: { q1: 'q1' }
			} as unknown as Request;
			const logger: Logger = new Logger('test', req);

			logger.error(logObject);

			expect(mockError).toHaveBeenCalledWith({
				method: 'GET',
				params: {
					p1: 'p1'
				},
				query: { q1: 'q1' },
				a: 'a',
				url: '/test'
			});
		})
	})
})
describe('loggerFactory', () => {
	it('creates a new Logger', () => {
		const logObject: LogObject = { a: 'a' }
		const req: Request = {
			originalUrl: '/test',
			method: 'GET',
			params: { p1: 'p1' },
			query: { q1: 'q1' }
		} as unknown as Request;
		const logger: Logger = loggerFactory('test', req);

		logger.info(logObject);

		expect(mockInfo).toHaveBeenCalledWith({
			method: 'GET',
			params: {
				p1: 'p1'
			},
			query: { q1: 'q1' },
			a: 'a',
			url: '/test'
		});
	})
	// it('does not need a request object', () => {
	// 	const logObject: LogObject = { a: 'a' }
	// 	const logger: Logger = loggerFactory('test');

	// 	logger.info(logObject);

	// 	expect(mockInfo).toHaveBeenCalledWith({ a: 'a' });
	// })
})
