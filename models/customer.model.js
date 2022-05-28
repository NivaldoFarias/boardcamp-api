import joi from 'joi';
import * as regex from './../blueprint/regex.js';

const CustomerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).pattern(regex.phone).required(),
  cpf: joi.string().length(11).pattern(regex.cpf).required(),
  birthday: joi.string().length(10).pattern(regex.birthday).required(),
});

export default CustomerSchema;
