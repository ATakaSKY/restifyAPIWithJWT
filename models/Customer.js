const mongoose = require('mongoose');
const mongooseTimestamp = require('mongoose-timestamp');

const CustomerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  }
});

CustomerSchema.plugin(mongooseTimestamp);

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
