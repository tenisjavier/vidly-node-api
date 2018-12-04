// @desc    main config module for env variables, dev: morgan
// @res     exit if key is not found
const config = require('config');
const debug = require('debug')('vidly:config');
const logger = require('./logger');
const morgan = require ('morgan');

function mainConfig() {
    // make sure the auth will work
    if(!config.get('jwtPrivateKey')) {
        debug('Error: jwtPrivateKey not define.');
        logger.error(' FATAL ERROR: jwtPrivateKey is not defined');
        process.exit(1);
    }
    debug('Main Config: Env Vars OK');
}

function initMorgan(app) {
    if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        debug('morgan enable...')
    }
}

module.exports = { 
        init: mainConfig,
        morgan: initMorgan
}