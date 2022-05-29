import express from 'express';

import customersRouter from './customers.router.js';
import categoriesRouter from './categories.router.js';
import gamesRouter from './games.router.js';
import rentalsRouter from './rentals.router.js';

const router = express.Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export default router;
