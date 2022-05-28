import joi from 'joi';

const CategorySchema = joi.object({
  name: joi.string().required(),
});

export default CategorySchema;
