// controller for the user api
const { User, validate } = require("../models/user-model");
const debug = require("debug")("vidly:db");
const _ = require("lodash");
const bcrypt = require("bcrypt");

// @desc    function used in route GET api/users/me
// @return  promise with the user of an especific id.
async function getUserById(id) {
    try {
        const result = await User.findById(id).select("-password -__v");
        debug("User by Id return successfully.");
        return result;
    } catch (ex) {
        debug(ex.message);
        return null;
    }
}

// @desc    function used in POST api/users
// @return  promise with the new user inserted in the ddbb.
async function createUser(body) {
    // obtain the data and InputVal with Joi, if error return.
    const { error } = validate(body);
    if (error) return { error: error.details[0].message };

    // validate if user does not exist.
    let user = await User.findOne({ email: body.email });
    if (user) return { error: "User already exist with that email." };

    try {
        user = new User(_.pick(body, ["name", "email", "password"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const result = await user.save();
        debug("User succesfully created.");
        return result;
    } catch (ex) {
        return ex.message;
    }
}

module.exports = {
    createUser: createUser,
    getUserById: getUserById
};
