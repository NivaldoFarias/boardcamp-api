import chalk from 'chalk';

import client from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllGames(_req, res) {
  try {
    const result = await client.query(`SELECT * FROM games;`);

    result.rows.length
      ? result.rows.forEach((row) => {
          console.log(
            chalk.blue(
              `${DATABASE} id: ${chalk.bold(row.id)} | category id: ${chalk.bold(
                row.categoryId,
              )} | name: ${chalk.bold(row.name)} | total stock: ${chalk.bold(
                row.stockTotal,
              )} | price per day: ${chalk.bold(row.pricePerDay)}`,
            ),
          );
        })
      : console.log(chalk.blue(`${DATABASE} No games`));

    res.status(200).send(result.rows);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while getting games`,
      detail: error,
    });
  }
}

export async function newGame(_req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;

  try {
    await client.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
      [name, image, stockTotal, categoryId, pricePerDay],
    );

    console.log(chalk.blue(`${DATABASE} game '${name}' created`));
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while creating new game`,
      detail: error,
    });
  }
}
