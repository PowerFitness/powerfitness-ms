export interface DbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database?: string;
    ssl?: string;
}

export interface Config {
    dbConfig: DbConfig
}
export const config = (): Config => ({
  dbConfig: {
    host: 'localhost',
    port: 3306,
    user: 'user',
    password: 'password',
    database: 'powerfitness'
  }
});
