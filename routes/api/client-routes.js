// @desc    client API routes
// @func    CRUD functions for the client collection
const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/client-api');
const auth = require('../../middleware/auth-middleware');
const admin = require('../../middleware/admin-middleware');
const validateId = require('../../middleware/validateId-middleware');

// @desc    return all the clients array, limit 10.
// @access  public
router.get('/', async (req, res) => {
    
    const result = await clientController.getClients();
    res.send(result);
    
});


// @desc    return a client with an especific id or null 404 not found
// @access  public
router.get('/:id', validateId, async (req, res) => {
    
    const result = await clientController.getClientById(req.params.id);
    if(!result) return res.status(404).send('Client not found.');
    res.send(result)
    
});


// @desc    insert a new client to the db
// @access  private
router.post('/', auth, async (req, res) => {
    
    const result = await clientController.createClient(req.body);
    if(result.validationError) return res.status(400).send(result.validationError);
    if(result.error) return res.status(400).send(result.error);
    res.send(result);

});


// @desc    update a client in the db
// @access  private
router.put('/:id', auth, async (req, res) => {

    const result = await clientController.updateClientById(req.params.id, req.body);
    if(!result) return res.status(404).send('Client not found.');
    if(result.validationError) return res.status(400).send(result.validationError);
    if(result.error) return res.status(400).send(result.error);
    res.send(result);

});


// @desc    delete a client
// @access  admin
router.delete('/:id', [auth, admin], async (req, res) => {
       
    const result = await clientController.removeClientById(req.params.id);
    if(!result) return res.status(404).send('Client not found.');
    res.send(result);

});

module.exports = router;