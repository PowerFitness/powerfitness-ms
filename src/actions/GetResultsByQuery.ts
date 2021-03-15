import { Action } from '../abstraction/Action';
import { ParsedQs } from 'qs';
import { buildWhereAndConditions } from '../util/buildConditions';
import DbProvider from '../abstraction/DbProvider';

export interface Result {
	id: number;
	userUniqueId: string;
	date: string;
	type: string;
	subtype: string;
	name: string;
	unit: string;
	value: number;
	createdDate: string;
	lastUpdatedDate: string;
}

interface ResultsMap {userUniqueId?:string, date?:string}

export class GetResultsByQuery extends Action<Array<Result>> {
	queryParams: ParsedQs;
	constructor(dbProvider: DbProvider, queryParams: ParsedQs) {
		super(dbProvider);
		this.queryParams = queryParams;
	}
	buildQuery(): string {
		const { userUniqueId, date } = this.queryParams;
		const whereMap: ResultsMap = {
			userUniqueId,
			date
		} as ResultsMap;
		if (Object.keys(whereMap).length === 0) {
			throw new Error('Missing criteria')
		}
		return `select * from result where ${buildWhereAndConditions(whereMap)}`
	}
}

export default GetResultsByQuery;
