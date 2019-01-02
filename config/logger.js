// @desc logger is in charge for logging error: Sentry.io
require("express-async-errors");

const Sentry = require("@sentry/node");
Sentry.init({
    dsn: "https://1f402e1c78b64577ae2effa527c33979@sentry.io/1362323"
});

function logError(err) {
    Sentry.captureException(err);
}

function captureMessage(msg) {
    Sentry.captureMessage(msg);
}

// The logger handle the uncaught exceptions but for promises we need this
process.on("unhandledRejection", ex => {
    throw ex;
});

module.exports = {
    error: logError,
    info: captureMessage
};
