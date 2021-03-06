import { Router, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import GetResultsByQuery from '../actions/GetResultsByQuery';
import { Result } from '../types/Result'
import { config } from '../config';
import DbProvider from '../abstraction/DbProvider';
import UpsertResultsCoordinator from '../coordinator/UpsertResultsCoordinator';
import loggerFactory, { Logger } from '../util/loggerFactory';
import { validateToken } from '../util/validateToken';
import { getToken } from '../util/getToken';
import jwtDecode from 'jwt-decode';
export class ResultsApi {
	static route: string = '/results'
	getRouter(): Router {
		const router: Router = Router();
		router.get('/', this.getResults.bind(this))
		router.put('/:userUniqueId/:date', this.putResults.bind(this))
		return router;
	}

	async getResults(req: Request, res: Response): Promise<void> {
		const logger: Logger = loggerFactory(ResultsApi.route, req);
		const userUniqueId: string = req.query.userUniqueId as string;

		try {
			const token: string = getToken(req);
			if (!await validateToken(token, logger)) {
				throw new Error('Invalid Token');
			}
			const uid: string = jwtDecode<{user_id: string}>(token).user_id
			if (uid !== userUniqueId) throw new Error('Not entitled for ' + userUniqueId)

			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const query: ParsedQs = req.query;
			const results: Array<Result> = await new GetResultsByQuery(dbProvider, query).execute();
			res.send(results)
		} catch (e) {
			logger.error(e)
			res.status(500);
			res.end();
		}
	}

	async putResults(req: Request, res: Response): Promise<void> {
		const logger: Logger = loggerFactory(ResultsApi.route, req);
		const { userUniqueId, date } = req.params;

		try {
			if (!userUniqueId || !date ) {
				throw new Error('Missing criteria');
			}
			const token: string = getToken(req);
			if (!await validateToken(token, logger)) {
				throw new Error('Invalid Token');
			}
			const uid: string = jwtDecode<{user_id: string}>(token).user_id
			if (uid !== userUniqueId) throw new Error('Not entitled for ' + userUniqueId)

			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const results: Array<Result> = req.body;

			await new UpsertResultsCoordinator(dbProvider, userUniqueId as string, date as string, results).upsertData();
			res.status(200);
			res.end();
		} catch (e) {
			logger.error(e)
			if (e.message === 'Missing criteria') {
				res.status(400);
			} else {
				res.status(500);
			}
			res.end();
		}
	}
}

export default ResultsApi;
