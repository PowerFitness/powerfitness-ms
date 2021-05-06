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
    dbConfig: DbConfig,
    adminCert: string | null
}

let adminCert: string | null = null;
if (process.env.NODE_APP_INSTANCE === 'production') {
	adminCert = '/Users/cjscholl/dev/power-fitness-309903-0cb72240573e.json'
}
if (process.env.NODE_APP_INSTANCE === 'localWithAuth') {
	adminCert = '/Users/cjscholl/Desktop/dev/power-fitness-309903-0cb72240573e.json'
}

export const config = (): Config => ({
	dbConfig: {
		host: process.env.MYSQL_HOST as string | undefined || 'localhost',
		port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
		user: process.env.MYSQL_USER as string | undefined || 'user',
		password: process.env.MYSQL_PASSWORD as string | undefined || 'password',
		database: 'powerfitness',
		dateStrings: true
	},
	adminCert
});
