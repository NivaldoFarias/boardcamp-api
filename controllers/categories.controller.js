import chalk from 'chalk';

import client from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllCategories(_req, res) {
  const {
    query: { offset, limit, orderBy },
  } = res.locals;

  try {
    const result = await client.query(`SELECT * FROM categories ${orderBy} ${offset} ${limit};`);

    result.rows.length
      ? console.log(
          chalk.blue(
            `${DATABASE} Found and sent ${chalk.bold(
              result.rows.length,
            )} entries from '${chalk.bold('categories')}'`,
          ),
        )
      : console.log(chalk.blue(`${DATABASE} No categories found`));

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
    await client.query(`INSERT INTO categories (name) VALUES ($1);`, [name]);

    console.log(chalk.blue(`${DATABASE} Category created`));
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while getting products`,
      detail: error,
    });
  }
}
