import express from 'express';

/* import {
  validateGame,
  checkUrl,
  categoryExists,
  checkGame,
} from './../middlewares/clients.middleware.js'; */
import * as clients from './../controllers/clients.controller.js';

const PATH = '/clients';
const clientsRouter = express.Router();

clientsRouter.get(PATH, clients.listAllClients);
clientsRouter.post(PATH, clients.newClient);

export default clientsRouter;
