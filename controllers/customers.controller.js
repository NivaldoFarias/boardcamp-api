import chalk from 'chalk';

import client from './../database/postgres.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

export async function listAllCustomers(_req, res) {
  const {
    query: { offset, limit, orderBy },
  } = res.locals;

  try {
    const result = await client.query(`SELECT * FROM customers ${orderBy} ${offset} ${limit};`);

    result.rows.length
      ? console.log(
          chalk.blue(
            `${DATABASE} Found and sent ${chalk.bold(
              result.rows.length,
            )} entries from '${chalk.bold('customers')}'`,
          ),
        )
      : console.log(chalk.blue(`${DATABASE} No customers found`));

    return res.status(200).send(result.rows);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while getting customers`,
      detail: error,
    });
  }
}

export async function newCustomer(_req, res) {
  const { name, phone, cpf, birthday } = res.locals.customer;

  try {
    await client.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday],
    );

    console.log(chalk.blue(`${DATABASE} Customer '${name}' created`));
    return res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while creating new customer`,
      detail: error,
    });
  }
}

export async function fetchCustomer(_req, res) {
  const { customer } = res.locals;
  return res.status(200).send(customer);
}

export async function updateCustomer(req, res) {
  const {
    customer: { name, phone, cpf, birthday },
  } = res.locals;
  const { id } = req.params;

  try {
    await client.query(
      `UPDATE 
        customers 
      SET 
        name = $1, 
        phone = $2, 
        cpf = $3, 
        birthday = $4
      WHERE 
        id = $5;`,
      [name, phone, cpf, birthday, id],
    );

    console.log(chalk.blue(`${DATABASE} Customer '${name}' updated`));
    return res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(`${ERROR} Internal server error`));
    return res.status(500).send({
      message: `Internal server error while updating customer`,
      detail: error,
    });
  }
}
