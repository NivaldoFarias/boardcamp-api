import express from 'express';

import {
  validateRental,
  getQueryData,
  findRental,
  rentalIsOngoing,
  findCustomer,
  findGame,
  gameInStock,
} from './../middlewares/rentals.middleware.js';
import {
  listAllRentals,
  newRental,
  returnRental,
  deleteRental,
} from './../controllers/rentals.controller.js';

const PATH = '/rentals';
const rentalsRouter = express.Router();

rentalsRouter.get(PATH, getQueryData, findCustomer, findGame, listAllRentals);
rentalsRouter.post(PATH, validateRental, findCustomer, findGame, gameInStock, newRental);
rentalsRouter.post(`${PATH}/:id/return`, findRental, rentalIsOngoing, findGame, returnRental);
rentalsRouter.delete(`${PATH}/:id`, findRental, rentalIsOngoing, deleteRental);

export default rentalsRouter;
