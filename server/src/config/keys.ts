import { Keys } from '../types';

const keys: Keys = {
  port: process.env.PORT || 4000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD
};

export default keys;
