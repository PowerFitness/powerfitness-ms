import { Action } from '../abstraction/Action';
import DbProvider from '../abstraction/DbProvider';
import { OkPacket } from 'mysql';
import { buildWhereOrConditions } from '../util/buildConditions';

export class DeleteBulkResultsById extends Action<OkPacket> {
	resultIds: Array<number>
	constructor(dbProvider: DbProvider, resultIds: Array<number>) {
		super(dbProvider);
		this.resultIds = resultIds;
	}
	buildQuery(): string {
		if (!this.resultIds.length) throw new Error('Missing criteria')
		return `delete from result where ${buildWhereOrConditions(this.resultIds, 'id')}`;
	}
}

export default DeleteBulkResultsById;
