// db connection is once per app
const mongoose = require('mongoose');
const debug = require('debug')('vidly:config');
const logger = require('./logger');
const config = require('config');

// connect to the db from env variable (test, dev or prod)
function dbconnect() {
 
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
    .then( () => {
        debug(`DB config: Connected to the ${db}...`);
    })
    .catch( (err) => {
        debug('DB config: Could not connect to the DB.');
        logger.error('Could not connect to the DB.', err);
        process.exit(1);
    });
 
}

module.exports.connect = dbconnect;