import { Router, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import DbProvider from '../abstraction/DbProvider';
import RetrievePlanCoordinator, { Plan } from '../coordinator/RetrievePlanCoordinator';
import { config } from '../config';
import UpsertPlanGoalsCoordinator from '../coordinator/UpsertPlanGoalsCoordinator';
import loggerFactory, { Logger } from '../util/loggerFactory';

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
		try {
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
		try {
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
