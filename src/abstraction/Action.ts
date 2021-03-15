import DbProvider from './DbProvider';

export abstract class Action<T> {
	dbProvider: DbProvider;
	constructor(dbProvider: DbProvider) {
		this.dbProvider = dbProvider;
	}

	abstract buildQuery(): string;

	execute(): Promise<T> {
		return this.dbProvider.execute<T>(this.buildQuery());
	}
}

export default Action;
