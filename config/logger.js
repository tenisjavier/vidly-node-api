// @desc logger is in charge for logging error
require('express-async-errors');
const winston = require('winston');
require('winston-loggly-bulk');

winston.add(winston.transports.File, { filename: 'logfile.log' } );
winston.add(winston.transports.Loggly, {
  inputToken: "9e1488c3-e3ea-42d4-b1f7-e8e2354a52e4",
  subdomain: "tenisjavier",
});  
// The logger handle the uncaught exceptions but for promises we need this
process.on('unhandledRejection', (ex) => {
    throw ex
});

module.exports = winston;