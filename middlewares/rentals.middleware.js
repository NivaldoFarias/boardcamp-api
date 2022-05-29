import chalk from 'chalk';
import urlExist from 'url-exist';

import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';
import GameSchema from './../models/game.model.js';
import client from './../database/postgres.js';

// RENTALS MIDDLEWARE
export async function validateRental(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const validate = GameSchema.validate({ customerId, gameId, daysRented }, { abortEarly: false });
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input data`));
    return res.status(400).send({
      message: 'Invalid input',
      detail: validate.error.details.map((e) => e.message.replaceAll('"', '')).join('; '),
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Rental schema validated`));
  res.locals.rental = { customerId, gameId, daysRented };
  next();
}

export async function getQueryData(req, res, next) {
  const customerId = req.query?.customerId;
  const gameId = req.query?.gameId;

  res.locals.rental = { customerId, gameId };
  next();
}

export async function findRental(req, res, next) {
  const { id } = req.params;

  try {
    const result = await client.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
    if (!result.rows.length) {
      console.log(chalk.red(`${ERROR} Rental not found`));
      return res.status(404).send({
        message: 'Rental not found',
        detail: `Ensure to provide a valid rental id`,
      });
    }
    res.locals.rental = result.rows[0];
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while getting rental`,
      detail: error,
    });
  }

  console.log(chalk.blue(`${MIDDLEWARE} Rental found`));
  next();
}

export async function rentalIsOngoing(_req, res, next) {
  const {
    rental: { returnDate },
  } = res.locals;

  if (returnDate) {
    console.log(chalk.red(`${ERROR} Rental has already been returned`));
    return res.status(400).send({
      message: 'Rental has already been returned',
      detail: `Ensure to provide a rental id corresponding to an ongoing rental`,
    });
  }

  console.log(chalk.blue(`${MIDDLEWARE} Rental is ongoing`));
  next();
}

// CUSTOMERS MIDDLEWARE
export async function findCustomer(_req, res, next) {
  const {
    rental: { customerId },
  } = res.locals;

  if (!customerId) next();

  try {
    const result = await client.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
    if (!result.rows.length) {
      console.log(chalk.red(`${ERROR} Customer not found`));
      return res.status(400).send({
        message: 'Customer not found',
        detail: `Ensure to provide a valid customer id`,
      });
    }
    res.locals.customer = result.rows[0];
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while getting customer`,
      detail: error,
    });
  }

  console.log(chalk.blue(`${MIDDLEWARE} Customer found`));
  next();
}

// GAMES MIDDLEWARE
export async function findGame(_req, res, next) {
  const {
    rental: { gameId },
  } = res.locals;

  if (!gameId) next();

  try {
    const result = await client.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
    if (!result.rows.length) {
      console.log(chalk.red(`${ERROR} Game not found`));
      return res.status(400).send({
        message: 'Game not found',
        detail: `Ensure to provide a valid game id`,
      });
    }
    res.locals.game = result.rows[0];
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while getting game`,
      detail: error,
    });
  }

  console.log(chalk.blue(`${MIDDLEWARE} Game found`));
  next();
}

export async function gameInStock(_req, res, next) {
  const {
    game: { stockTotal },
  } = res.locals;

  if (stockTotal === 0) {
    console.log(chalk.red(`${ERROR} Game is out of stock`));
    return res.status(400).send({
      message: 'Game is out of stock',
      detail: `Try again later, the game is not available at the moment`,
    });
  }

  next();
}
