import { Router, Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import GetResultsByQuery, { Result } from '../actions/GetResultsByQuery';
import { config } from '../config';
import DbProvider from '../abstraction/DbProvider';

export class ResultsApi {
	static route: string = '/results'
	getRouter(): Router {
		const router: Router = Router();
		router.get('/', (...args) => this.getResults(...args))
		return router;
	}

	async getResults(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const query: ParsedQs = req.query;
			const results: Array<Result> = await new GetResultsByQuery(dbProvider, query).execute();
			res.send(results)
		} catch (e) {
			console.error(e.message)
		}
	}
}

export default ResultsApi;
