import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

import { SERVER } from './blueprint/chalk.js';
//import router from './routes/index.js';

const PORT = process.env.API_PORT || 5000;
const app = express();
app.use(cors());
app.use(json());
//app.use(router);

app.get('/', (_req, res) => {
  res.send('Online');
});

app.listen(PORT, () => {
  console.log(chalk.bold.yellow(`${SERVER} Server started on port ${PORT}`));
});
