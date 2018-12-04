//@desc     verify id user is admin or not.
const debug = require ('debug')('vidly:middleware');
function adminAuth(req, res, next) {
    if(!req.user.isAdmin) {
        debug('Admin is False');
        return res.status(403).send(' Access denied.');
    }
    debug('Admin is True');
    next();
}

module.exports = adminAuth;