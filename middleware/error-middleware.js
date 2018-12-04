// @desc    middleware that it will catch all the errors
// @func    send 500 to the user and to log error in the logfile

const logger = require('../config/logger');
const debug = require('debug')('vidly:error');
function errorHandler(err, req, res, next) {
    debug('Error 500:', err.message )
    logger.error(err.message, err);
    res.status(500).send('Something failed.');
}
module.exports = errorHandler;