import DbProvider from '../abstraction/DbProvider';
import GetPlansByQuery, { Plan as PlanDetails } from '../actions/GetPlansByQuery';
import GetGoalsByPlanId, { Goal } from '../actions/GetGoalsByPlanId';
import { ParsedQs } from 'qs';

export interface Plan extends PlanDetails {
	goals?: Array<Goal>
}

export class RetrievePlanCoordinator {
	dbProvider: DbProvider;
	queryParams: ParsedQs;
	constructor (dbProvider: DbProvider, queryParams: ParsedQs) {
		this.dbProvider = dbProvider;
		this.queryParams = queryParams;
	}
	async retrieveData(): Promise<Plan> {
		const planDetails: PlanDetails = (await new GetPlansByQuery(this.dbProvider, this.queryParams).execute())[0];
		const goals: Array<Goal> = await new GetGoalsByPlanId(this.dbProvider, planDetails.id).execute();

		return { ...planDetails, goals };
	}
}

export default RetrievePlanCoordinator;
