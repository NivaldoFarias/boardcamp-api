import chalk from 'chalk';
import SqlString from 'sqlstring';

import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';
import RentalSchema from './../models/rental.model.js';
import client from './../database/postgres.js';

// RENTALS MIDDLEWARE
export async function validateRental(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const validate = RentalSchema.validate({ customerId, gameId, daysRented }, { abortEarly: false });
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input data`));
    return res.status(400).send({
      message: 'Invalid input',
      detail: validate.error.details.map((e) => e.message.replaceAll('"', '')).join('; '),
    });
  }

  console.log(chalk.bold.magenta(`${MIDDLEWARE} Rental schema validated`));
  res.locals.rental = { customerId, gameId, daysRented };
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

  console.log(chalk.bold.magenta(`${MIDDLEWARE} Rental found`));
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

  console.log(chalk.bold.magenta(`${MIDDLEWARE} Rental is ongoing`));
  next();
}

// CUSTOMERS MIDDLEWARE
export async function findCustomer(_req, res, next) {
  const {
    rental: { customerId },
  } = res.locals;

  if (customerId) {
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

    console.log(chalk.bold.magenta(`${MIDDLEWARE} Customer found`));
  }

  next();
}

// GAMES MIDDLEWARE
export async function findGame(_req, res, next) {
  const {
    rental: { gameId },
  } = res.locals;

  if (gameId) {
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
    console.log(chalk.bold.magenta(`${MIDDLEWARE} Game found`));
  }

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

  console.log(chalk.bold.magenta(`${MIDDLEWARE} Game is in stock`));
  next();
}

export async function reduceGameStock(_req, res, next) {
  const {
    game: { id, stockTotal },
  } = res.locals;

  try {
    await client.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2;`, [stockTotal - 1, id]);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while reducing game stock`,
      detail: error,
    });
  }

  console.log(chalk.bold.magenta(`${MIDDLEWARE} Game stock reduced`));
  next();
}

// QUERY DATA MIDDLEWARE
export async function conditionalIds(req, res, next) {
  let conditional = '';
  const customerId = req.query?.customerId;
  const gameId = req.query?.gameId;

  if (customerId && gameId) {
    conditional = `WHERE "customerId" = ${SqlString.escape(
      customerId,
    )} AND "gameId" = ${SqlString.escape(gameId)}`;
  } else if (customerId && !gameId) {
    conditional = `WHERE "customerId" = ${SqlString.escape(customerId)}`;
  } else if (!customerId && gameId) {
    conditional = `WHERE "gameId" = ${SqlString.escape(gameId)}`;
  }

  res.locals.query = { ...res.locals.query, conditional };
  res.locals.rental = { ...res.locals.rental, customerId, gameId };
  next();
}

export async function rentalsQuery(req, res, next) {
  let {
    query: { conditional },
  } = res.locals;

  if (req.query?.status === 'open') {
    conditional = `${conditional} AND "returnDate" IS NULL`;
  } else if (req.query?.status === 'closed') {
    conditional = `${conditional} AND "returnDate" IS NOT NULL`;
  }

  if (req.query?.startDate) {
    const startDate = new Date(req.query.startDate);
    const dateISO = startDate.toISOString();
    conditional = `${conditional} AND "rentDate" >= ${dateISO}`;
  }

  res.locals.query = { ...res.locals.query, conditional };
  next();
}

export async function metricsQuery(req, res, next) {
  let interval = '';

  if (req.query?.startDate) {
    const startDate = new Date(req.query.startDate);
    const dateISO = startDate.toISOString();
    interval += `WHERE "rentDate" >= ${dateISO}`;
  }
  if (req.query?.endDate) {
    const endDate = new Date(req.query.endDate);
    const endDateISO = endDate.toISOString();
    interval += ` AND "rentDate" <= ${endDateISO}`;
  }

  res.locals.interval = interval;
  next();
}
