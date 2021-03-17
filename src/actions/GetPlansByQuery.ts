import { Action } from '../abstraction/Action';
import { buildWhereAndConditions } from '../util/buildConditions';
import { ParsedQs } from 'qs';
import DbProvider from '../abstraction/DbProvider';

export interface Plan {
	id: number;
	userUniqueId: string;
	motivationStatement: string;
	createdDate: string;
	lastUpdatedDate: string;
}

interface PlansWhereMap { id?: number; userUniqueId?: string; }

export class GetPlansByQuery extends Action<Array<Plan>> {
	queryParams: ParsedQs;
	constructor(dbProvider: DbProvider, queryParams: ParsedQs) {
		super(dbProvider);
		this.queryParams = queryParams;
	}
	buildQuery(): string {
		const { id, userUniqueId } = this.queryParams;
		const whereMap: PlansWhereMap = {
			id,
			userUniqueId
		} as PlansWhereMap;
		if (Object.keys(whereMap).length === 0) {
			throw new Error('Missing criteria')
		}
		return `select * from plan where ${buildWhereAndConditions(whereMap)}`;
	}
}

export default GetPlansByQuery;
