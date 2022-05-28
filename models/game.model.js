import joi from 'joi';

const urlRegex = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i',
);
const imageRegex = new RegExp(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/im);
const GameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().pattern(urlRegex).pattern(imageRegex).required(),
  stockTotal: joi.number().required(),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().required(),
});

export default GameSchema;
