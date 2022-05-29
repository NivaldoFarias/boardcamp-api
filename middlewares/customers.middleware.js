import chalk from 'chalk';

import { MIDDLEWARE, ERROR } from './../blueprint/chalk.js';
import CustomerSchema from './../models/customer.model.js';
import client from './../database/postgres.js';

export async function validateCustomer(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;

  const validate = CustomerSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false });
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input data`));
    return res.status(400).send({
      message: 'Invalid input',
      detail: validate.error.details.map((e) => e.message.replaceAll('"', '')).join('; '),
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Customer schema validated`));
  res.locals.customer = { name, phone, cpf, birthday };
  next();
}

export async function findCustomer(req, res, next) {
  const { id } = req.params;

  try {
    const result = await client.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
    if (!result.rows.length) {
      console.log(chalk.red(`${ERROR} Customer not found`));
      return res.status(404).send({
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

  console.log(
    chalk.magenta(`${MIDDLEWARE} Customer '${chalk.bold(res.locals.customer.name)}' found`),
  );
  next();
}

export async function checkCpf(_req, res, next) {
  const { cpf } = res.locals.customer;

  try {
    const result = await client.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
    if (result.rowCount > 0 && result.rows[0].cpf !== cpf) {
      console.log(chalk.red(`${ERROR} Cpf already registered`));
      return res.status(409).send({
        message: `Cpf already registered`,
        detail: `Ensure to provide a unique, valid cpf`,
      });
    }
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    res.status(500).send({
      message: `Internal server error while checking cpf registry`,
      detail: error,
    });
  }

  console.log(chalk.magenta(`${MIDDLEWARE} Cpf is unique`));
  next();
}
