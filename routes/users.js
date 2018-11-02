const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = server => {
  server.post('/register', async (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        user.password = hash;

        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err));
        }
      });
    });
  });

  //get user
  server.post('/user', async (req, res, next) => {
    try {
      const user = await auth.authenticate(req.body.email, req.body.password);

      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m'
      });

      const { iat, exp } = jwt.decode(token);

      res.send({ iat, exp, token });
    } catch (err) {
      return next(new errors.UnauthorizedError(err));
    }
  });
};
