import DbProvider from '../abstraction/DbProvider';
import { Result } from '../types/Result';
import UpsertBulkResults from '../actions/UpsertBulkResults';
import GetResultsByQuery from '../actions/GetResultsByQuery';
import DeleteBulkResultsById from '../actions/DeleteBulkResultsById';

export class UpsertResultsCoordinator {
	dbProvider: DbProvider;
	userUniqueId: string;
	date: string;
	results: Result[];
	constructor (dbProvider: DbProvider, userUniqueId: string, date: string, results: Result[] = []) {
		this.dbProvider = dbProvider;
		this.userUniqueId = userUniqueId;
		this.date = date;
		this.results = results;
	}

	async _getResultIdsToDelete(): Promise<Array<number>> {
		const existingResults: Array<Result> = await new GetResultsByQuery(
			this.dbProvider, { date: this.date, userUniqueId: this.userUniqueId }
		).execute();
		const resultIds: Array<number> = existingResults.filter((existingResult) => {
			return !this.results.find(function(result) {
				return result.id === existingResult.id
			})
		}).map(result => result.id);
		return resultIds;
	}

	async upsertData(): Promise<void> {
		this.dbProvider.beginTransaction();

		const resultIdsToDelete: Array<number> = await this._getResultIdsToDelete();
		if (resultIdsToDelete.length > 0) {
			await new DeleteBulkResultsById(this.dbProvider, resultIdsToDelete).execute();
		}

		if (this.results.length > 0) {
			const newResultsArray: Result[] = this.results.map(result => ({
				...result,
				userUniqueId: this.userUniqueId,
				date: this.date
			}));
			await new UpsertBulkResults(this.dbProvider, newResultsArray).execute();
		}

		this.dbProvider.commit();
	}
}

export default UpsertResultsCoordinator;
