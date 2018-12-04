// db schemas
const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre-model');

// define schema
const movieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 2,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    tags: [String],
    numberInStock: { 
        type: Number, 
        required: true, 
        min: 0,
        max: 255
    },
    dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        rental: 255  
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});    

// create Movie class
const Movie = mongoose.model('Movie', movieSchema);

// function validate movie input
function validateMovie(movie) {

    const schema = {
        title: Joi.string().min(2).max(255).required(),
        genreId: Joi.objectId().required(),
        tags: Joi.array().optional(),
        numberInStock: Joi.number().required().min(0).max(255),
        dailyRentalRate: Joi.number().required().min(0).max(255),
        isPublished: Joi.boolean().default(false, 'Set to default if not defined.')
    }

    return Joi.validate(movie, schema) 
}

module.exports = {
    Movie: Movie,
    validate: validateMovie
}