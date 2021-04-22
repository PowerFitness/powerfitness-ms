import bunyan from 'bunyan';
import { Request } from 'express';
import { ParsedQs } from 'qs';

interface ParamsDictionary {
    [key: string]: string;
}
export type LogObject = Record<string, string | number | boolean | null | ParamsDictionary | ParsedQs | Record<string, never>>;

export class Logger {
	name: string;
	req: Request | null;
	log: bunyan;
	constructor(name: string, req?: Request) {
		this.name = name;
		this.req = req || null;
		this.log = bunyan.createLogger({ name });
	}
	static _getErrorLogObject(error: Error): LogObject {
		const { message, stack } = error;
		let src: string = '';
		if (stack) {
			const splitStack: Array<string> = stack.split('\n');
			if (splitStack.length > 1) {
				src = `${splitStack[0]} ${splitStack[1]}`
			}
		}
		return { message, src };
	}

	_addExtraRequestInfo(logObject: LogObject): LogObject {
		return {
			url: this.req?.originalUrl || null,
			method: this.req?.method || null,
			params: this.req?.params || null,
			query: this.req?.query || null,
			...logObject
		}
	}

	_logByMethod(method: 'info' | 'debug' | 'error', errorOrLogObject: LogObject | Error, logObject?: LogObject): boolean | void {
		if (errorOrLogObject.constructor === Error) {
			const errorLogObject: LogObject = Logger._getErrorLogObject(errorOrLogObject as Error);
			if (logObject) {
				return this.log[method](this._addExtraRequestInfo({ ...logObject, ...errorLogObject }))
			}
			return this.log[method](this._addExtraRequestInfo(errorLogObject))
		} else {
			return this.log[method](this._addExtraRequestInfo(errorOrLogObject as LogObject));
		}
	}

	info(logOjbect: LogObject): void;
	info(error: Error): void;
	info(error: Error, logObject?: LogObject): void;

	// Implementation
	info(errorOrLogObject: LogObject | Error, logObject?: LogObject): void {
		this._logByMethod('info', errorOrLogObject, logObject)
	}

	// Overloads
	debug(logObject: LogObject): void;
	debug(error: Error): void;
	debug(error: Error, logObject?: LogObject): void;

	// Implementations
	debug(errorOrLogObject: LogObject | Error, logObject?: LogObject): void {
		this._logByMethod('debug', errorOrLogObject, logObject)
	}

	// Overloads
	error(logOjbect: LogObject): void;
	error(error: Error): void;
	error(error: Error, logObject?: LogObject): void;

	// Implementation
	error(errorOrLogObject: LogObject | Error, logObject?: LogObject): void {
		this._logByMethod('error', errorOrLogObject, logObject)
	}
}

export default (name: string, req?: Request): Logger => new Logger(name, req);
