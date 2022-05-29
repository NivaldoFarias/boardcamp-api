import express from 'express';

import { getQueryData } from './../middlewares/global.middleware.js';
import {
  validateRental,
  findRental,
  rentalIsOngoing,
  findCustomer,
  findGame,
  gameInStock,
  reduceGameStock,
  conditionalIds,
  rentalsQuery,
} from './../middlewares/rentals.middleware.js';
import {
  listAllRentals,
  newRental,
  returnRental,
  deleteRental,
} from './../controllers/rentals.controller.js';

const PATH = '/rentals';
const rentalsRouter = express.Router();

rentalsRouter.get(
  PATH,
  getQueryData,
  conditionalIds,
  rentalsQuery,
  findCustomer,
  findGame,
  listAllRentals,
);
rentalsRouter.post(
  PATH,
  validateRental,
  findCustomer,
  findGame,
  gameInStock,
  reduceGameStock,
  newRental,
);
rentalsRouter.post(`${PATH}/:id/return`, findRental, rentalIsOngoing, findGame, returnRental);
rentalsRouter.delete(`${PATH}/:id`, findRental, rentalIsOngoing, deleteRental);

export default rentalsRouter;
