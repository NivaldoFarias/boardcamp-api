import express from 'express';

import {
  validateCategory,
  checkCategory,
  getQueryData,
} from './../middlewares/categories.middleware.js';
import { listAllCategories, newCategory } from './../controllers/categories.controller.js';

const PATH = '/categories';
const categoriesRouter = express.Router();

categoriesRouter.get(PATH, getQueryData, listAllCategories);
categoriesRouter.post(PATH, validateCategory, checkCategory, newCategory);

export default categoriesRouter;
