const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

// const jwt = require('restify-jwt-community');

const server = restify.createServer();

//Middleware
server.use(restify.plugins.bodyParser());

//protect routes
//server.use(jwt({ secret: config.JWT_SECRET }).unless({ path: ['/user'] }));

server.listen(config.PORT, () => {
  console.log('%s listening at %s', server.name, server.url);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

const db = mongoose.connection;

db.on('error', err => console.log(err));

db.once('open', () => {
  require('./routes/customers')(server);
  require('./routes/users')(server);
  console.log(`Server started on port ${config.PORT}`);
});
