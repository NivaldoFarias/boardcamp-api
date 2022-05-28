import express from 'express';

import { validateCategory, checkCategory } from './../middlewares/categories.middleware.js';
import * as categories from './../controllers/categories.controller.js';

const PATH = '/categories';
const categoriesRouter = express.Router();

categoriesRouter.get(PATH, categories.listAllCategories);
categoriesRouter.post(PATH, validateCategory, checkCategory, categories.newCategory);

export default categoriesRouter;
