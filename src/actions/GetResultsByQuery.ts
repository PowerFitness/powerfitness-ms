import { Action } from '../abstraction/Action';
import { ParsedQs } from 'qs';
import { buildWhereAndConditions } from '../util/buildConditions';
import DbProvider from '../abstraction/DbProvider';
import { Result } from '../types/Result'

interface ResultsMap {userUniqueId?:string, date?:string}

export class GetResultsByQuery extends Action<Array<Result>> {
	queryParams: ParsedQs;
	constructor(dbProvider: DbProvider, queryParams: ParsedQs) {
		super(dbProvider);
		this.queryParams = queryParams;
	}
	buildQuery(): string {
		const { userUniqueId, date } = this.queryParams;
		if (Object.keys(this.queryParams).length === 0) {
			throw new Error('Missing criteria')
		}
		const whereMap: ResultsMap = {
			userUniqueId,
			date
		} as ResultsMap;

		return `select * from result where ${buildWhereAndConditions(whereMap)}`
	}
}

export default GetResultsByQuery;
