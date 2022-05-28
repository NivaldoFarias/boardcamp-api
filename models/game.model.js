import joi from 'joi';
import * as regex from './../blueprint/regex.js';

const GameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().pattern(regex.url).pattern(regex.image).required(),
  stockTotal: joi.number().required(),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().required(),
});

export default GameSchema;
