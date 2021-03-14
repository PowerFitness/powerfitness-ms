import { Action } from '../abstraction/Action';
import { ParsedQs } from 'qs';
import { buildWhereConditions } from '../util/buildWhereConditions';
import { DbConfig } from '../config'

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
	constructor(dbConfig: DbConfig, queryParams: ParsedQs) {
		super(dbConfig);
		this.queryParams = queryParams;
	}
	buildQuery(): string {
		const { userUniqueId, date } = this.queryParams;
		const whereMap: ResultsMap = {
			userUniqueId,
			date
		} as ResultsMap;
		return `select * from result where ${buildWhereConditions(whereMap)}`
	}
}

export default GetResultsByQuery;
