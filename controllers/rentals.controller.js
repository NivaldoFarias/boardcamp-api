import chalk from 'chalk';

import client from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllRentals(_req, res) {
  const {
    query: { offset, limit, orderBy, conditional },
  } = res.locals;
  try {
    const result = await client.query(
      `${selectRentals()} ${conditional} ${orderBy} ${offset} ${limit};`,
    );

    result.rows.length
      ? console.log(
          chalk.blue(
            `${DATABASE} Found and sent ${chalk.bold(
              result.rows.length,
            )} entries from '${chalk.bold('rentals')}'`,
          ),
        )
      : console.log(chalk.blue(`${DATABASE} No rentals found`));

    const processedOutput = normalizeResult(result.rows);

    return res.status(200).send(processedOutput);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while getting rentals`,
      detail: error,
    });
  }
}

export async function newRental(_req, res) {
  const {
    rental: { customerId, gameId, daysRented },
    game: { pricePerDay },
  } = res.locals;
  const rentDate = getDate();
  const returnDate = null;
  const originalPrice = daysRented * pricePerDay;
  const delayFee = null;

  try {
    await client.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee],
    );

    console.log(chalk.blue(`${DATABASE} Rental entry created`));
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while creating new rental entry`,
      detail: error,
    });
  }
}

export async function returnRental(_req, res) {
  const {
    rental: { id, rentDate },
    game: { pricePerDay },
  } = res.locals;
  const returnDate = getDate();
  const delayFee = getDelayFee(returnDate, rentDate, pricePerDay);

  try {
    await client.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [
      returnDate,
      delayFee,
      id,
    ]);

    console.log(chalk.blue(`${DATABASE} Rental entry updated`));
    return res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while updating rental entry`,
      detail: error,
    });
  }
}

export async function deleteRental(_req, res) {
  const {
    rental: { id },
  } = res.locals;

  try {
    await client.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

    console.log(chalk.blue(`${DATABASE} Rental entry deleted`));
    return res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while deleting rental entry`,
      detail: error,
    });
  }
}

export async function getMetrics(_req, res) {
  const { interval } = res.locals;

  try {
    const result = await client.query(
      `SELECT SUM ("originalPrice") AS revenue, count(*) AS rentals FROM rentals ${interval};`,
    );
    const output = { ...result.rows[0], average: result.rows[0].revenue / result.rows[0].rentals };
    console.log(chalk.blue(`${DATABASE} Metrics sent`));
    return res.status(200).send(output);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while getting metrics`,
      detail: error,
    });
  }
}

const normalizeResult = (rentals) => {
  const output = [];
  for (const index in rentals) {
    const rental = rentals[index];
    output.push({
      ...rental,
      customer: {
        id: rental.customerId,
        name: rental.customerName,
      },
      game: {
        id: rental.gameId,
        name: rental.gameName,
        categoryId: rental.categoryId,
        categoryName: rental.categoryName,
      },
    });
    delete output[index].customerName;
    delete output[index].gameName;
    delete output[index].categoryId;
    delete output[index].categoryName;
  }
  return output;
};

const selectRentals = () => {
  return `SELECT 
    rentals.*,
    customers.name AS "customerName",
    games.name AS "gameName",
    categories.id AS "categoryId",
    categories.name AS "categoryName"
    FROM 
      rentals
    INNER JOIN
      customers
    ON
      rentals."customerId" = customers.id
    INNER JOIN
      games
    ON
      rentals."gameId" = games.id
    INNER JOIN
      categories
    ON
      games."categoryId" = categories.id`;
};

const getDelayFee = (returnDateISO, rentDateISO, pricePerDay) => {
  const returnDate = new Date(returnDateISO);
  const rentDate = new Date(rentDateISO.toISOString().split('T')[0]);
  const diffTime = Math.abs(returnDate - rentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * pricePerDay;
};

const getDate = () => {
  let today = new Date();
  today.toISOString().split('T')[0];
  const offset = today.getTimezoneOffset();
  today = new Date(today.getTime() - offset * 60 * 1000);
  return today.toISOString().split('T')[0];
};
