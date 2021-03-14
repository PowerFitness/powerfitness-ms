import { Router, Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import GetPlansByQuery, { Plan } from '../actions/GetPlansByQuery';
import { config } from '../config';

export class PlanApi {
	static route: string = '/plan'
	getRouter(): Router {
		const router: Router = Router();
		router.get('/', (...args) => this.getPlan(...args))
		return router;
	}

	async getPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const query: ParsedQs = req.query;
			const plan: Plan = (await new GetPlansByQuery(config().dbConfig, query).execute())[0];
			res.send(plan)
		} catch (e) {
			console.log(e.message)
			res.status(500);
			res.end();
		}
	}
}


export default PlanApi;
