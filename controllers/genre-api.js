// @desc    constroller for the Genre API
// @func    CRUD for the genres collection
const { Genre, validate } = require('../models/genre-model');
const debug = require('debug')('vidly:controller');


// @desc    function used in route GET api/genres
// @return  promise with the 10 genres as result
async function getGenres() {
    
    const result = await Genre.find().limit(10).sort({ name:1 });
    debug('Genres return successfully.');
    return result

}


// @desc    function used in route GET api/genres/:id
// @return  promise with the genre of an especific id
async function getGenreById(id) {

    const result = await Genre.findById(id);        
    debug('Genres by Id return successfully.');
    return result

}
 

// @desc    function used in POST api/genre
// @return  promise with the new genre inserted in the ddbb
async function createGenre(body) {
    
    // obtain the data and InputVal with Joi, if error return
    const { error } = validate(body);
    if(error) return { error: error.details[0].message };

    const genreInfo = { name: body.name, isPublished: true }
    const genre = new Genre(genreInfo);
    const result = await genre.save();

    debug(`Genre succesfully created. id:${result._id}`);
    return result;
 
}


// @desc    function used in route PUT api/genres/:id
// @return  promise with the updated element as result
async function updateGenreById(id, body) {
    
    // obtain the data and InputVal with Joi
    const { error } = validate(body);
    if(error) return { error: error.details[0].message };

    let result;
    const genre = await Genre.findById(id);
    if(genre) {
        genre.name = body.name;
        result = await genre.save();
        debug('Genre succesfully updated.');
    }
    return result
    

}


// @desc    function used in route DELETE api/genres/:id
// @return  promise with the delete element as result
async function removeGenreById(id) {
    
    const result = await Genre.findByIdAndDelete(id);       
    debug('Genre remove process ran successfully...');
    return result

}


module.exports = {
    getGenres: getGenres,
    getGenreById: getGenreById,
    createGenre: createGenre,
    updateGenreById: updateGenreById,
    removeGenreById: removeGenreById
}