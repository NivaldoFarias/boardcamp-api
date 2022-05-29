import chalk from 'chalk';

import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';
import CategorySchema from './../models/category.model.js';
import client from './../database/postgres.js';

export async function validateCategory(req, res, next) {
  const { name } = req.body;

  const validate = CategorySchema.validate({ name }, { abortEarly: false });
  if (validate.error) {
    console.log(chalk.red(`${ERROR} ${validate.error.details.map((e) => e.message).join('; ')}`));
    return res.status(400).send({
      message: 'Invalid input',
      detail: validate.error.details.map((e) => e.message.replaceAll('"', '')).join('; '),
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Category schema validated`));
  res.locals.name = name;
  next();
}

export async function checkCategory(_req, res, next) {
  const { name } = res.locals;

  try {
    const result = await client.query(`SELECT * FROM categories WHERE name = $1;`, [name]);
    if (result.rowCount > 0) {
      console.log(chalk.red(`${ERROR} Category already exists`));
      return res.status(409).send({
        message: 'Category already exists',
        detail: `Ensure that the category name is unique`,
      });
    }
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while checking category`,
      detail: error,
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Category is unique`));
  next();
}

export async function getQueryData(req, res, next) {
  const offset = req.query?.offset ? `OFFSET ${SqlString.escape(req.query.offset)}` : '';
  const limit = req.query?.limit ? `LIMIT ${SqlString.escape(req.query.limit)}` : '';
  const orderDirection = req.query?.desc ? 'DESC' : '';
  const orderBy = req.query?.order
    ? `ORDER BY ${SqlString.escape(req.query.order)} ${orderDirection}`
    : '';

  res.locals.query = { offset, limit, orderBy };
  next();
}
