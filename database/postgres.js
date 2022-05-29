import pg from 'pg';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

import { DATABASE, ERROR } from './../blueprint/chalk.js';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;
const client = new Client({ connectionString });

try {
  await client.connect();
  console.log(chalk.bold.blue(`${DATABASE} Connected to database`));
} catch (error) {
  console.log(chalk.red(`${ERROR} Internal server error while connecting to database`));
}

export default client;
