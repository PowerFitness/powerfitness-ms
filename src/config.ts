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
        host: '',
        port: 0,
        user: '',
        password: '',
        database: '',
        ssl: ''
    }
});