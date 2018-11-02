const errors = require('restify-errors');
const Customer = require('../models/Customer');
const jwt = require('restify-jwt-community');
const config = require('../config');

module.exports = server => {
  //get all customers
  server.get('/customers', async (req, res, next) => {
    try {
      const Customers = await Customer.find({});
      res.send(Customers);
      next();
    } catch (err) {
      return next(new errors.NotFoundError(err));
    }
  });

  //get single customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const Customers = await Customer.findById({ _id: req.params.id });
      res.send(Customers);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  //add customer
  server.post(
    '/customers',
    jwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json")
        );
      }

      const { name, email, balance } = req.body;

      const customer = new Customer({
        name,
        email,
        balance
      });

      try {
        const newCustomer = await customer.save();
        res.send(201);
        next();
      } catch (err) {
        return next(errors.InternalError(err.message));
      }
    }
  );

  //update customer
  server.put(
    '/customers/:id',
    jwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json")
        );
      }

      try {
        await Customer.findByIdAndUpdate(req.params.id, req.body);
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  //delete customer
  server.del(
    '/customers/:id',
    jwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        await Customer.findByIdAndRemove(req.params.id);
        res.send(204);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );
};
