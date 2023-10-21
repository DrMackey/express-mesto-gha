const jwt = require('jsonwebtoken');

const InternalServer = require('../errors/internalserver');
const Unauthorized = require('../errors/unauthorized');

const JWT_SECRET = 'token';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new InternalServer('ой, что то пошло не так...'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
