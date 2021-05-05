import { DbConfig } from '../config'
import { createConnection, Connection, MysqlError } from 'mysql';

export class DbProvider {
	dbConfig: DbConfig;
	connection: Connection | null = null;
	constructor(dbConfig: DbConfig) {
		this.dbConfig = dbConfig;
	}
	establishConnection(): void {
		if(!this.connection) {
			this.connection = createConnection(this.dbConfig)
		}
		return;
	}
	execute<T>(query: string): Promise<T> {
		this.establishConnection();
		return new Promise((resolve, reject) => {
			(this.connection as Connection).query(query, (error: MysqlError, results: T) => {
				if (error) {
					reject(error)
				} else {
					resolve(results)
				}
				(this.connection as Connection).end()
			})
		}) as unknown as Promise<T>;
	}

	beginTransaction(): Promise<void> {
		this.establishConnection();
		return new Promise((resolve, reject) =>
			(this.connection as Connection).beginTransaction((err: MysqlError) => err ? reject(err) : resolve()));
	}

	commit(): Promise<void> {
		this.establishConnection();
		return new Promise((resolve, reject) => (this.connection as Connection).commit((err: MysqlError) => {
			if (err) {
				this.rollback()
					.then(() => reject(err))
					.catch((rollbackError: MysqlError) =>
						reject(new Error(`Rollback Failed: ${err.message} / ${rollbackError.message}`)))
					.finally(() =>
						(this.connection as Connection).end())
			} else {
				resolve();
				(this.connection as Connection).end()
			}
		}));
	}

	rollback(): Promise<void> {
		return new Promise((resolve, reject) =>
			(this.connection as Connection).rollback((err: MysqlError) => err ? reject(err) : resolve()));
	}
}

export default DbProvider;
