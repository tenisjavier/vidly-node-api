const { User } = require('../../../models/user-model');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

//@desc     test generateAuthToken with a in code private key (test.json).
//@expect   that the decoded token is exactly the payload that created it.
describe('generateAuthToken', () => {
    it('should return a web token.', () => {
        const payload = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(payload);
    });
});