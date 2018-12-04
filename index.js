const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('./config/main-config');
const db = require('./config/db-config');
const routes = require('./routes/main-routes');
const debug = require('debug')('vidly:config');
const production = require('./config/production');

// verify if env is ok
config.init();

// init express, req.body and db connection.
const app = express();
app.use(express.json());
db.connect();

// dev: init morgan
config.morgan(app);

// init the app routes
routes.init(app);

// prod: init production middlewares
production(app);

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    debug(`Listening to port ${port}...`);
});

module.exports = server;