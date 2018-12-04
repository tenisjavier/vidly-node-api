//@desc     Genre Schema with Joi Validation
//@exports  Genre class, genreSchema and Joi input validation function.
const mongoose = require('mongoose');
const Joi = require('joi');

// define schema
const genreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        lowercase: true,
        maxlength: 50,
        minlength: 3
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});    

// create Genre class
const Genre = mongoose.model('Genre', genreSchema);

// function validate genre input
function validateGenre(genre) {

    const schema = {
        name: Joi.string().min(3).max(50).required(),
        isPublished: Joi.boolean().default(false, 'Set to false if not defined.')
    }
    return Joi.validate(genre, schema) 
    
}

module.exports = {
    Genre: Genre,
    validate: validateGenre,
    genreSchema: genreSchema
}