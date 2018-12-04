// @desc    rentals API routes
// @func    CRUD functions for the rentals collection
const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rental-api');
const auth = require('../../middleware/auth-middleware');
const admin = require('../../middleware/admin-middleware');


// @desc    return all the rentals limit 10
// @access  public
router.get('/', async (req, res) => {
    
    const result = await rentalController.getRentals()
    res.send(result);

});


// @desc    return a rental with an especific id or null 404 not found
// @access  public
router.get('/:id', async (req, res) => {
    
    const result = await rentalController.getRentalById(req.params.id);
    if(!result) return res.status(404).send('Rental not found.');
    res.send(result)
    
});


// @desc    insert a new rental to the db
// @access  private
router.post('/', auth, async (req, res) => {
    
    const result = await rentalController.createRental(req.body);
    if(result.validationError) return res.status(400).send(result.validationError);
    if(result.error) return res.status(400).send(result.error);
    res.send(result);

});


// @desc    delete a rental
// @access  admin
router.delete('/:id', [auth, admin] , async (req, res) => {

    const result = await rentalController.removeRentalById(req.params.id);
    if(!result) return res.status(404).send('Rental not found.');
    res.send(result);

});


module.exports = router;