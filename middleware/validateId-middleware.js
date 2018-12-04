//@desc     Middleware that validates the ID 
//@return   404 if is not a valid mongoose ID, else Next()
const mongoose = require('mongoose');
const debug = require('debug')('vidly:middleware');

module.exports = function(req, res, next) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        debug('Invalid ID');
        return res.status(404).send('Invalid ID');
    } 
    next();
}