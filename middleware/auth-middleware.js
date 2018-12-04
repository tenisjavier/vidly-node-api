const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('vidly:middleware');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token){
        debug('Access denied. No token provided.');
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decode;
        debug('Access Approved');
        next();
    }
    catch(err) {
        debug('Invalid Token');
        res.status(400).send('Invalid Token')
    }
}

module.exports = auth;