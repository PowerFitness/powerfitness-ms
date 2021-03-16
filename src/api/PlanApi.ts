import { Router, Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import DbProvider from '../abstraction/DbProvider';
import RetrievePlanCoordinator, { Plan } from '../coordinator/RetrievePlanCoordinator';
import { config } from '../config';
import UpsertPlanGoalsCoordinator from '../coordinator/UpsertPlanGoalsCoordinator';

export class PlanApi {
	static route: string = '/plan'
	getRouter(): Router {
		const router: Router = Router();
		router.get('/', (...args) => this.getPlan(...args))
		router.put('/', (...args) => this.putPlan(...args))
		return router;
	}

	async getPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const query: ParsedQs = req.query;
			const plan: Plan = (await new RetrievePlanCoordinator(dbProvider, query).retrieveData());
			res.send(plan)
		} catch (e) {
			console.log(e.message)
			res.status(500);
			res.end();
		}
	}

	async putPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const dbProvider: DbProvider = new DbProvider(config().dbConfig);
			const plan: Plan = req.body;
			const planId: number = (await new UpsertPlanGoalsCoordinator(dbProvider, plan).upsertData());
			res.send(planId.toString());
		} catch (e) {
			console.log(e.message)
			res.status(500);
			res.end();
		}
	}
}


export default PlanApi;
