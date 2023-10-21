const jwt = require('jsonwebtoken');

const JWT_SECRET = 'token';

const UNAUTHORIZED = 401;

function PromiseError() {
  return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
}

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    PromiseError();
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
