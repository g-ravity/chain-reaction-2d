import { Keys } from '../types';

const keys: Keys = {
	nodeEnv: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 4000,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	redisHost: process.env.REDIS_HOST_NAME || 'localhost',
	redisPort: +process.env.REDIS_PORT || 6379,
	redisPassword: process.env.REDIS_PASSWORD || 'dkvjbkj-ebwbje-bjh3hb',
	playerJoined: 'PLAYER_JOINED',
	playerLeft: 'PLAYER_LEFT',
	gameStarted: 'GAME_STARTED',
	changeTurn: 'CHANGE_TURN',
	gameOver: 'GAME_OVER',
};

export default keys;
