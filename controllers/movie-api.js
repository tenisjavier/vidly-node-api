// @desc    constroller for the Movies API
// @func    CRUD for the movies collection
const { Movie, validate } = require("../models/movie-model");
const debug = require("debug")("vidly:controller");
const { Genre } = require("../models/genre-model");

// @desc    function used in route GET api/movies
// @return  promise with limit 10 movies as result
async function getMovies() {
    const result = await Movie.find()
        .limit(10)
        .sort({ title: 1 });
    debug("GET /api/movies/ Movies return successfully.");
    return result;
}

// @desc    function used in route GET api/movies/:id
// @return  promise with the movie of an especific id.
async function getMovieById(id) {
    const result = await Movie.findById(id);
    debug("Movies by Id return successfully.");
    return result;
}

// @desc    function used in route GET api/movies/genre/:id
// @return  promise with the movie of an especific id.
async function getMovieByGenre(genreId) {
    const result = await Movie.find({ "genre._id": genreId });
    debug("Movies by Genre return successfully.");
    return result;
}

// @desc    function used in POST api/movies
// @return  promise with the new movie inserted in the ddbb.
async function createMovie(body) {
    // obtain the data and InputVal with Joi, if error return.
    const { error } = validate(body);
    if (error) return { error: error.details[0].message };

    // validate genre of the movie
    const genre = await Genre.findById(body.genreId, "_id name");
    if (!genre) return { error: "Invalid Genre." };

    const movieInfo = {
        title: body.title,
        genre: { _id: genre._id, name: genre.name },
        tags: body.tags,
        numberInStock: body.numberInStock,
        dailyRentalRate: body.dailyRentalRate,
        isPublished: true
    };
    const movie = new Movie(movieInfo);
    const result = await movie.save();
    debug(`Movie succesfully created. id:${result._id}`);
    return result;
}

// @desc    function used in route PUT api/movies/:id
// @return  promise with the updated element as result
async function updateMovieById(id, body) {
    // obtain the data and InputVal with Joi
    const { error } = validate(body);
    if (error) return { validationError: error.details[0].message };

    // get movie buy id return null if not found
    const movie = await Movie.findById(id);
    movie.title = body.title;
    movie.genre = body.genre;
    movie.tags = body.tags;
    const result = await movie.save();
    debug("Movie updated successfully.");
    return result;
}

// @desc    function used in route DELETE api/movies/:id
// @return  promise with the delete element as result
async function removeMovieById(id) {
    const result = await Movie.findByIdAndDelete(id);
    debug("Movie deleted process ran successfully...");
    return result;
}

module.exports = {
    getMovies: getMovies,
    getMovieById: getMovieById,
    getMovieByGenre: getMovieByGenre,
    createMovie: createMovie,
    updateMovieById: updateMovieById,
    removeMovieById: removeMovieById
};
