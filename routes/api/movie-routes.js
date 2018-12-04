// @desc    movies API routes
// @func    CRUD functions for the movie collection
const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/movie-api');
const auth = require('../../middleware/auth-middleware');
const admin = require('../../middleware/admin-middleware');
const validateId = require('../../middleware/validateId-middleware');

// @desc    return all the movies limit 10
// @access  public
router.get('/', async (req, res) => {
    
    const result = await movieController.getMovies();
    res.send(result);

});


// @desc    return a movie with an especific id or null 404 not found
// @access  public
router.get('/:id', validateId, async (req, res) => {
    
    const result = await movieController.getMovieById(req.params.id);
    if(!result) return res.status(404).send('Movie not found.');
    res.send(result)
    
});


// @desc    insert a new movie to the db
// @access  private
router.post('/', auth, async (req, res) => {
    
    const result = await movieController.createMovie(req.body);;
    if(result.error) return res.status(400).send(result.error);
    res.send(result);

});


// @desc    update a movie in the db
// @access  private
router.put('/:id', [ auth, validateId], async (req, res) => {

    const result = await movieController.updateMovieById(req.params.id, req.body);
    if(!result) return res.status(404).send('Movie not found.');
    if(result.error) return res.status(400).send(result.error);
    res.send(result);

});


// @desc    delete a movie
// @access  admin
router.delete('/:id', [ auth, admin, validateId] , async (req, res) => {

    const result = await movieController.removeMovieById(req.params.id);
    if(!result) return res.status(404).send('Movie not found.');
    res.send(result);

});


module.exports = router;