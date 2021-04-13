import { Action } from '../abstraction/Action';
import DbProvider from '../abstraction/DbProvider';
import { OkPacket } from 'mysql';
import { buildWhereOrConditions } from '../util/buildConditions';

export class DeleteBulkGoalsById extends Action<OkPacket> {
	goalIds: Array<number>
	constructor(dbProvider: DbProvider, goalIds: Array<number> = []) {
		super(dbProvider);
		this.goalIds = goalIds;
	}
	buildQuery(): string {
		if (!this.goalIds.length) throw new Error('Missing criteria')
		return `delete from goal where ${buildWhereOrConditions(this.goalIds, 'id')}`;
	}
}

export default DeleteBulkGoalsById;
