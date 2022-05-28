import chalk from 'chalk';

import pool from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllCategories(_req, res) {
  try {
    const result = await pool.query(`SELECT * FROM categories;`);

    console.log(chalk.blue(`${DATABASE} ${result.rows}`));
    res.status(200).send(result.rows);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while getting products`,
      detail: error,
    });
  }
}

export async function newCategory(_req, res) {
  const { name } = res.locals;

  try {
    const result = await pool.query(
      `INSERT INTO categories (name) VALUES ($1);`,
      [name],
    );

    console.log(chalk.blue(`${DATABASE} ${result}`));
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while getting products`,
      detail: error,
    });
  }
}
