const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });

      bcrypt.compare(password, user.password, (err, res) => {
        if (err) return err;

        if (res) {
          resolve(user);
        } else {
          reject('Authentication failed');
        }
      });
    } catch (err) {
      reject('Authentication failed');
    }
  });
};
