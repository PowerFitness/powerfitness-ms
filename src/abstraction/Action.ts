import { DbConfig } from '../config'
import { createConnection, Connection, MysqlError } from 'mysql';

let dbConnection: Connection | null = null;

export abstract class Action<T> {
    dbConfig: DbConfig;
    constructor(dbConfig: DbConfig) {
      this.dbConfig = dbConfig;
    }

    abstract buildQuery(): string;

    getConnection(): Connection {
      if(!dbConnection) {
        dbConnection = createConnection(this.dbConfig)
      }
      return dbConnection
    }

    execute(): Promise<T> {
      const connection: Connection = this.getConnection();
      return new Promise((resolve, reject) => {
        connection.query(this.buildQuery(), (error: MysqlError, results: T) => {
          if (error) {
            reject(error)
          } else {
            resolve(results)
          }
        })
      }) as unknown as Promise<T>
    }
}

export default Action;
