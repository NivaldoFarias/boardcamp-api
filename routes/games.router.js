import express from 'express';

import { getQueryData } from './../middlewares/global.middleware.js';
import {
  validateGame,
  checkUrl,
  categoryExists,
  checkGame,
} from './../middlewares/games.middleware.js';
import { listAllGames, newGame } from './../controllers/games.controller.js';

const PATH = '/games';
const gamesRouter = express.Router();

gamesRouter.get(PATH, getQueryData, listAllGames);
gamesRouter.post(PATH, validateGame, checkUrl, categoryExists, checkGame, newGame);

export default gamesRouter;
