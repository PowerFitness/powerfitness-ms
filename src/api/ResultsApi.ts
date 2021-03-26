import { Router, Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import GetResultsByQuery from '../actions/GetResultsByQuery';
import { Result } from '../types/Result'
import { config } from '../config';
import DbProvider from '../abstraction/DbProvider';
import UpsertResultsCoordinator from '../coordinator/UpsertResultsCoordinator';

export class ResultsApi {
	static route: string = '/results'
	getRouter(): Router {
		const router: Router = Router();
		router.get('/', (...args) => this.getResults(...args))
		router.put('/', (...args) => this.putResults(...args))
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

	async putResults(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const results: Result [] = req.body;
			await new UpsertResultsCoordinator(dbProvider, results).upsertData();
			res.send()
		} catch (e) {
			console.error(e.message)
		}
	}
}

export default ResultsApi;
