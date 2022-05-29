import joi from 'joi';

const RentalSchema = joi.object({
  customerId: joi.number().positive().integer().required(),
  gameId: joi.number().positive().integer().required(),
  daysRented: joi.number().positive().integer().required(),
});

export default RentalSchema;
