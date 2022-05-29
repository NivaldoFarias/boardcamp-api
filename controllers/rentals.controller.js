import chalk from 'chalk';

import client from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllRentals(_req, res) {
  const { customerId, gameId } = res.locals;

  try {
    const result = await possibleQueries();

    result.rows.length
      ? console.log(chalk.blue(`${DATABASE} Number of rentals: ${result.rows.length}`))
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

  async function possibleQueries() {
    if (customerId && gameId) {
      return await client.query(`${selectRentals()} WHERE "customerId" = $1 AND "gameId" = $2;`, [
        customerId,
        gameId,
      ]);
    } else if (gameId && !customerId) {
      return await client.query(`${selectRentals()} WHERE "gameId" = $1;`, [gameId]);
    } else if (customerId && !gameId) {
      return await client.query(`${selectRentals()} WHERE "customerId" = $1;`, [customerId]);
    } else if (!customerId && !gameId) {
      return await client.query(selectRentals());
    }
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
  const diffTime = Math.abs(returnDate - rentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const delayFee = diffDays * pricePerDay;

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

const normalizeResult = (rentals) => {
  const output = [];
  for (const rental of rentals) {
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
  }
  return output;
};

const selectRentals = () => {
  return `SELECT 
    rentals.*,
    customers.name AS "customerName",
    games.name AS "gameName",
    categories.id AS "categoryId",
    categories.name AS "categoryName",
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

const getDate = () => {
  let today = new Date();
  today.toISOString().split('T')[0];
  const offset = today.getTimezoneOffset();
  today = new Date(today.getTime() - offset * 60 * 1000);
  return today.toISOString().split('T')[0];
};
