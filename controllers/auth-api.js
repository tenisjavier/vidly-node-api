// @desc    controller for the auth routes.
// @func    log in the user 
const { User } = require('../models/user-model');
const debug = require('debug')('vidly:controller');
const bcrypt = require('bcrypt');
const Joi = require('joi');


// @desc    function used in POST api/auth
// @return  promise with the web token.
async function login(body) {
    
    // obtain the data and InputVal with Joi, if error return.
    const { error } = validate(body);
    if(error) return { error: error.details[0].message };

    // validate if user does not exist.
    let user = await User.findOne({ email: body.email });
    if(!user) return { error: 'Invalid Email or Password' }

    // compare passwords
    const validPassword = await bcrypt.compare(body.password, user.password);
    if(!validPassword) return { error: 'Invalid Email or Password' }

    const token = user.generateAuthToken();
    debug('Login Success');
    return token
}   

// function validate user input
function validate(body) {

    const schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(body, schema) 
}

module.exports = {
    login: login
}