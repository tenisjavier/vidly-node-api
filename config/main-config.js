// @desc    main config module for env variables, dev: morgan.
//          Middleware used in production. Helmet for security, compression for compression.
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const debug = require("debug")("vidly:config");

// @desc    check if private key is set
function checkPrivateKey() {
    if (!config.get("jwtPrivateKey")) {
        debug("Error: jwtPrivateKey not define.");
        throw new Error(" FATAL ERROR: jwtPrivateKey is not defined");
    }
    debug("Private Key set correctly");
}

// @desc    setup morgan
function developmentSetup(app) {
    if (app.get("env") === "development") {
        const morgan = require("morgan");
        app.use(morgan("tiny"));
        debug("Development Setup completed");
    }
}

// @desc    setup helmet and compression
function productionSetup(app) {
    app.use(helmet());
    app.use(compression());
    debug("Production Setup completed");
}

// @desc    init trigger all config functions
function init(app) {
    checkPrivateKey();
    developmentSetup(app);
    productionSetup(app);
}

module.exports.init = init;
