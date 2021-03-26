import DbProvider from '../abstraction/DbProvider';
import { OkPacket } from 'mysql';
import { Result } from '../types/Result';
import UpsertBulkResults from '../actions/UpsertBulkResults';


export class UpsertResultsCoordinator {
	dbProvider: DbProvider;
	result: Result[];
	constructor (dbProvider: DbProvider, result: Result[]) {
		this.dbProvider = dbProvider;
		this.result = result;
	}

	async upsertData(): Promise<number> {
		this.dbProvider.beginTransaction();

		const upsertResultOkPacket: OkPacket = await new UpsertBulkResults(this.dbProvider, this.result).execute();
		const resultId: number = upsertResultOkPacket.insertId;

		this.dbProvider.commit();

		return resultId;
	}
}

export default UpsertResultsCoordinator;
