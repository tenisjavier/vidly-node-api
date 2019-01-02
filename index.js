const express = require("express");
const config = require("./config/main-config");
const db = require("./config/db-config");
const routes = require("./routes/main-routes");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// init express, req.body and db connection.
const app = express();
app.use(express.json());
db.connect();

// verify if env is ok and set dev and prod config
config.init(app);

// init the app routes
routes.init(app);

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
});

module.exports = server;
