import express from 'express';

import { getQueryData } from './../middlewares/global.middleware.js';
import { validateCustomer, findCustomer, checkCpf } from './../middlewares/customers.middleware.js';
import {
  listAllCustomers,
  newCustomer,
  fetchCustomer,
  updateCustomer,
} from './../controllers/customers.controller.js';

const PATH = '/customers';
const customersRouter = express.Router();

customersRouter.get(PATH, getQueryData, listAllCustomers);
customersRouter.post(PATH, validateCustomer, checkCpf, newCustomer);
customersRouter.get(`${PATH}/:id`, findCustomer, fetchCustomer);
customersRouter.put(`${PATH}/:id`, validateCustomer, findCustomer, checkCpf, updateCustomer);

export default customersRouter;
