import express from 'express';

import {
  validateGame,
  checkUrl,
  categoryExists,
  checkGame,
} from './../middlewares/games.middleware.js';
import * as games from './../controllers/games.controller.js';

const PATH = '/games';
const gamesRouter = express.Router();

gamesRouter.get(PATH, games.listAllGames);
gamesRouter.post(PATH, validateGame, checkUrl, categoryExists, checkGame, games.newGame);

export default gamesRouter;
