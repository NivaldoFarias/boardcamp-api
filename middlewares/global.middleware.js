export async function getQueryData(req, res, next) {
  const offset = req.query?.offset ? `OFFSET ${SqlString.escape(req.query.offset)}` : '';
  const limit = req.query?.limit ? `LIMIT ${SqlString.escape(req.query.limit)}` : '';
  const orderDirection = req.query?.desc ? 'DESC' : '';
  const orderBy = req.query?.order
    ? `ORDER BY ${SqlString.escape(req.query.order)} ${orderDirection}`
    : '';
  const test = 'test';

  res.locals.query = { offset, limit, orderBy, test };
  next();
}
