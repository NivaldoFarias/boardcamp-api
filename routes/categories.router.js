import express from 'express';

import {
  validateCategory,
  checkCategory,
} from './../middlewares/categories.middleware.js';
import * as categories from './../controllers/categories.controller.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/categories', categories.listAllCategories);
categoriesRouter.post(
  '/categories',
  validateCategory,
  checkCategory,
  categories.newCategory,
);

export default categoriesRouter;
