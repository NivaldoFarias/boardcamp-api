import express from 'express';

import categoriesRouter from './categories.router.js';
import gamesRouter from './games.router.js';

const router = express.Router();

router.use(categoriesRouter);
router.use(gamesRouter);

export default router;
