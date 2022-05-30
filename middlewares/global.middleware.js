import SqlString from 'sqlstring';

export async function getQueryData(req, res, next) {
  const offset = req.query?.offset ? SqlString.format(`OFFSET ?`, [req.query.offset]) : '';
  const limit = req.query?.limit ? SqlString.format(`LIMIT ?`, [req.query.limit]) : '';

  res.locals.query = { ...res.locals.query, offset, limit };
  next();
}
