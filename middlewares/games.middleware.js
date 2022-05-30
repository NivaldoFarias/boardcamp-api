import chalk from 'chalk';
import urlExist from 'url-exist';

import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';
import GameSchema from './../models/game.model.js';
import client from './../database/postgres.js';

export async function validateGame(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validate = GameSchema.validate(
    { name, image, stockTotal, categoryId, pricePerDay },
    { abortEarly: false },
  );
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input data`));
    return res.status(400).send({
      message: 'Invalid input',
      detail: validate.error.details.map((e) => e.message.replaceAll('"', '')).join('; '),
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Game schema validated`));
  res.locals.game = { name, image, stockTotal, categoryId, pricePerDay };
  next();
}

export async function checkUrl(_req, res, next) {
  const { image } = res.locals.game;

  try {
    await urlExist(image);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Invalid image url`));
    return res.status(404).send({
      message: 'Provided url is not valid',
      deatil: 'Ensure to provide a valid url',
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Valid image url`));
  next();
}

export async function categoryExists(_req, res, next) {
  const { categoryId } = res.locals.game;

  try {
    const result = await client.query(`SELECT * FROM categories WHERE id = $1;`, [categoryId]);

    if (result.rows.length === 0) {
      console.log(chalk.red(`${ERROR} Category not found`));
      return res.status(400).send({
        message: 'Category not found',
        detail: 'Ensure to provde a category id that matches an id of a category in the database',
      });
    }
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: 'Internal server error while checking category',
      detail: error,
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Category exists`));
  next();
}

export async function checkGame(_req, res, next) {
  const { name } = res.locals.game;

  try {
    const result = await client.query(`SELECT * FROM games WHERE name = $1;`, [name]);
    if (result.rowCount > 0) {
      console.log(chalk.red(`${ERROR} Game already exists`));
      return res.status(409).send({
        message: 'Game already exists',
        detail: `Ensure that the game's name is unique`,
      });
    }
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while checking whether game exists`,
      detail: error,
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Name is unique`));
  next();
}

export async function gamesQuery(req, res, next) {
  const orderFilters = ['id', 'name', 'image', 'stockTotal', 'categoryId', 'pricePerDay'];
  const orderDirection = req.query?.desc ? 'DESC' : '';
  let orderBy = '';
  if (req.query?.order) {
    if (!orderFilters.includes(req.query.order)) {
      console.log(chalk.red(`${ERROR} Invalid order filter`));
      return res.status(400).send({
        message: 'Invalid order filter',
        detail: `Ensure to provide a valid order filter`,
      });
    }
    orderBy = `ORDER BY "${req.query.order}" ${orderDirection}`;
  }

  res.locals.query = { ...res.locals.query, orderBy };
  next();
}
