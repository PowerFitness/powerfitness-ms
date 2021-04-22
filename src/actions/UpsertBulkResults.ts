import { Action } from '../abstraction/Action';
import DbProvider from '../abstraction/DbProvider';
import { OkPacket } from 'mysql';
import { Result } from '../types/Result';
import { buildBulkInsertValues } from '../util/buildConditions';

export class UpsertBulkResults extends Action<OkPacket> {
	results: Result[];
	constructor(dbProvider: DbProvider, results: Result[]) {
		super(dbProvider);
		this.results = results;
	}
	buildQuery(): string {
		return ` 
		insert into result
			(id, userUniqueId, date, type, subtype, name, unit, value, createdDate, lastUpdatedDate)
		values
		${buildBulkInsertValues([ 'id', 'userUniqueId', 'date', 'type', 'subtype', 'name', 'unit', 'value', 'createdDate', 'lastUpdatedDate' ],
		this.results)}			
		on duplicate key update
			value= VALUES(value), lastUpdatedDate = VALUES(lastUpdatedDate)`
	}
}

export default UpsertBulkResults;

