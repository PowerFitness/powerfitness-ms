import { Action } from '../abstraction/Action';
import DbProvider from '../abstraction/DbProvider';
import { OkPacket, escape } from 'mysql';
import { Plan } from '../types/Plan';

export class UpsertPlan extends Action<OkPacket> {
	plan: Plan;
	constructor(dbProvider: DbProvider, plan: Plan) {
		super(dbProvider);
		this.plan = plan;
	}
	buildQuery(): string {
		const { id, userUniqueId, motivationStatement } = this.plan;
		return `insert into plan 
					(id, userUniqueId, motivationStatement, createdDate, lastUpdatedDate)
				values 
					(
						${id ? escape(id) : null}, 
						${escape(userUniqueId)}, 
						${escape(motivationStatement)}, 
						${'CURRENT_TIMESTAMP()'}, 
						${'CURRENT_TIMESTAMP()'}
					)
				on duplicate key update
					motivationStatement = ${escape(motivationStatement)}, lastUpdatedDate = ${'CURRENT_TIMESTAMP()'}`;
	}
}

export default UpsertPlan;
