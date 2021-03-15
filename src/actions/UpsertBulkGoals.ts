import { Action } from '../abstraction/Action';
import DbProvider from '../abstraction/DbProvider';
import { OkPacket } from 'mysql';
import { buildBulkInsertValues } from '../util/buildConditions';
import { Goal } from '../types/Goal';

export class UpsertBulkGoals extends Action<OkPacket> {
	goalsList: Array<Goal>;
	constructor(dbProvider: DbProvider, goalsList: Array<Goal>) {
		super(dbProvider);
		this.goalsList = goalsList;
	}
	buildQuery(): string {
		return `
		insert into goal 
			(id, planId, type, name, unit, value, createdDate, lastUpdatedDate)
		values 
		${buildBulkInsertValues([ 'id', 'planId', 'type', 'name', 'unit', 'value', 'createdDate', 'lastUpdatedDate' ],
		this.goalsList)}
		on duplicate key update
			type = VALUES(type), name = VALUES(name), unit = VALUES(unit), lastUpdatedDate = VALUES(lastUpdatedDate)`;
	}
}

export default UpsertBulkGoals;
