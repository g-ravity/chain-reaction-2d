declare namespace NodeJS {
	export interface ProcessEnv {
		NODE_ENV: string;
		PORT: string;
		DB_URI: string;
		REDIS_HOST: string;
		REDIS_PORT: string;
	}
}
