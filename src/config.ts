export interface DbConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database?: string;
    ssl?: string;
    dateStrings: boolean;
}

export interface Config {
    dbConfig: DbConfig
}
export const config = (): Config => ({
	dbConfig: {
		host: process.env.MYSQL_HOST as string | undefined || 'localhost',
		port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
		user: process.env.MYSQL_USER as string | undefined || 'user',
		password: process.env.MYSQL_PASSWORD as string | undefined || 'password',
		database: 'powerfitness',
		dateStrings: true
	}
});
