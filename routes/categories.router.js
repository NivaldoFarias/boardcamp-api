import express from 'express';

import { getQueryData } from './../middlewares/global.middleware.js';
import {
  validateCategory,
  checkCategory,
  categoriesQuery,
} from './../middlewares/categories.middleware.js';
import { listAllCategories, newCategory } from './../controllers/categories.controller.js';

const PATH = '/categories';
const categoriesRouter = express.Router();

categoriesRouter.get(PATH, getQueryData, categoriesQuery, listAllCategories);
categoriesRouter.post(PATH, validateCategory, checkCategory, newCategory);

export default categoriesRouter;
