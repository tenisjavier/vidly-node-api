// db schemas
const mongoose = require('mongoose');
const Joi = require('joi');


// define schema
const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    isGold: { type: Boolean, default: false},
    date: { type: Date, default: Date.now },
});    

// create Client class
const Client = mongoose.model('Client', clientSchema);

// function validate client input with Joi
function validateClient(client) {

    const schema = {
        name: Joi.string().min(5).max(90).required(),
        phone: Joi.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).min(5).max(50).required()
    }

    return Joi.validate(client, schema) 
}


module.exports = {
    Client: Client,
    validate: validateClient
}