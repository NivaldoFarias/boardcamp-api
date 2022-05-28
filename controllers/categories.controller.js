import chalk from 'chalk';

import client from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllCategories(_req, res) {
  try {
    const result = await client.query(`SELECT * FROM categories;`);

    if (result.rows.length) {
      result.rows.forEach((row) => {
        console.log(
          chalk.blue(`${DATABASE} id: ${chalk.bold(row.id)} | name: ${chalk.bold(row.name)}`),
        );
      });
    } else console.log(chalk.blue(`${DATABASE} No categories`));

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
