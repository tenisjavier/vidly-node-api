// @desc    constroller for the Rentals API
// @func    CRUD logic for the rentals collection
const { Rental, validate } = require('../models/rental-model');
const { Client } = require('../models/client-model');
const { Movie } = require('../models/movie-model');
const debug = require('debug')('vidly:controller');
const mongoose = require('mongoose');
const Fawn = require('fawn');

Fawn.init(mongoose);

// @desc    function used in route GET api/rentals
// @return  promise with the 10 rentals as result
async function getRentals() {
    
    try {
        const result = await Rental.find().limit(10).sort('-dateOut');
        debug('GET /api/rentals/ Rentals return successfully.');
        return result
    }
    catch (ex) {
        return ex.message
    }
}


// @desc    function used in route GET api/rentals/:id
// @return  promise with the rental of an especific id.
async function getRentalById(id) {
    
    try {
        const result = await Rental.findById(id);        
        debug('Rentals by Id return successfully.')
        return result
    }
    catch (ex) {
        debug(ex.message);
        return null
    }

}
 

// @desc    function used in POST api/rentals
// @return  promise with the new rental inserted in the ddbb.
async function createRental(body) {
    
    try {
    
        // obtain the data and InputVal with Joi, if error return.
        const { error } = validate(body);
        if(error) return { validationError: error.details[0].message };

        // validate costumer
        const client = await Client.findById(body.clientId);
        if(!client) return { validationError: 'Invalid clientId.' }

        // validate movie
        const movie = await Movie.findById(body.movieId);
        if(!movie) return { validationError: 'Invalid movieId.' } 

        // validate stock
        if(movie.numberInStock === 0) return { validationError: 'Movie with no stock.' } 

        const rentalInfo = {
            client: {
                _id: client.id,
                name: client.name,
                isGold: client.isGold,
                phone: client.phone
            },
            movie: {
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        }
        const rental = new Rental(rentalInfo);

        // create task for emulate a transaction
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id}, {
                $inc: { numberInStock: -1 }
            })
            .run();
        debug('Rental created and numberInStock updated')
        return rental
    }

    // mongo validation errors
    catch (ex) {
        console.log(ex.message)
        let errorMessage = "";
        for (fields in ex.errors)              
            errorMessage = errorMessage + ex.errors[fields];
            debug(errorMessage);
            return { error: errorMessage }
    }
}


// @desc    function used in route DELETE api/rentals/:id
// @return  promise with the delete element as result
async function removeRentalById(id) {
    
    // get and delete rental
    try {
        const result = await Rental.findByIdAndDelete(id);       
        debug('Rental deleted process ran successfully...');
        return result
    }
    catch (ex) {
        debug('Error when deleting rental.');
        return null
    }

}


module.exports = {
    getRentals: getRentals,
    getRentalById: getRentalById,
    createRental: createRental,
    removeRentalById: removeRentalById
}