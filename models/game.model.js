import joi from 'joi';
import * as regex from './../blueprint/regex.js';

const GameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().pattern(regex.url).pattern(regex.image).required(),
  stockTotal: joi.number().positive().integer().required(),
  categoryId: joi.number().positive().integer().required(),
  pricePerDay: joi.number().positive().required(),
});

export default GameSchema;
