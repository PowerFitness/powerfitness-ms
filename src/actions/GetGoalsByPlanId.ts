import { Action } from '../abstraction/Action';
import DbProvider from '../abstraction/DbProvider';
import { escape } from 'mysql';

export interface Goal {
    id: number;
    planId: number;
    type: string;
    name: string;
    unit: string;
    value: number;
    createdDate: string;
    updatedDate: string;
}

export class GetGoalsByPlanId extends Action<Array<Goal>> {
	planId: number;
	constructor(dbProvider: DbProvider, planId: number) {
		super(dbProvider);
		this.planId = planId;
	}
	buildQuery(): string {
		if (!this.planId) throw new Error('Missing criteria');
		return `select * from goal where planId = ${escape(this.planId)}`;
	}
}

export default GetGoalsByPlanId;
