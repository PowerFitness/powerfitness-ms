import { Router, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import DbProvider from '../abstraction/DbProvider';
import RetrievePlanCoordinator, { Plan } from '../coordinator/RetrievePlanCoordinator';
import { config } from '../config';
import UpsertPlanGoalsCoordinator from '../coordinator/UpsertPlanGoalsCoordinator';
import loggerFactory, { Logger } from '../util/loggerFactory';
import { validateToken } from '../util/validateToken';
import { getToken } from '../util/getToken';
import jwtDecode from 'jwt-decode';

export class PlanApi {
	static route: string = '/plan'
	getRouter(): Router {
		const router: Router = Router();
		router.get('/', this.getPlan.bind(this))
		router.put('/', this.putPlan.bind(this))
		return router;
	}

	async getPlan(req: Request, res: Response): Promise<void> {
		const logger: Logger = loggerFactory(PlanApi.route, req);
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
			const plan: Plan | null = (await new RetrievePlanCoordinator(dbProvider, query).retrieveData());
			if (plan) {
				res.send(plan)
			} else {
				res.send({});
			}
		} catch (e) {
			logger.error(e);
			res.status(500);
			res.end();
		}
	}

	async putPlan(req: Request, res: Response): Promise<void> {
		const logger: Logger = loggerFactory(PlanApi.route, req);
		const userUniqueId: string = req.body.userUniqueId as string;
		try {
			const token: string = getToken(req);
			if (!await validateToken(token, logger)) {
				throw new Error('Invalid Token');
			}
			const uid: string = jwtDecode<{user_id: string}>(token).user_id
			if (uid !== userUniqueId) throw new Error('Not entitled for ' + userUniqueId)

			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const plan: Plan = req.body;
			const planId: number = (await new UpsertPlanGoalsCoordinator(dbProvider, plan).upsertData());
			res.send(planId.toString());
		} catch (e) {
			logger.error(e)
			res.status(500);
			res.end();
		}
	}
}


export default PlanApi;
