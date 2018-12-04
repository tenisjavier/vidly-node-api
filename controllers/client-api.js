// @desc    controller for the client routes.
// @func    CRUD logic for clients collection
const { Client, validate } = require('../models/client-model');
const debug = require('debug')('vidly:controller');


// @desc    function used in route GET api/clients
// @return  promise with limit 10 clients as result
async function getClients() {

    const result = await Client.find().limit(10).sort({ name: 1 });
    debug('GET /api/clients/ Clients return successfully.');
    return result
    
}


// @desc    function used in route GET api/client/:id
// @return  promise with the client of an especific id.
async function getClientById(id) {

    const result = await Client.findById(id);
    debug('GET /api/clients/:id Client by Id return successfully.');
    return result

}


// @desc    function used in route POST api/client
// @return  promise with the new client inserted in the ddbb.
async function createClient(body) {
    
    // obtain the data and InputVal with Joi, if error return.
    const { error } = validate(body);
    if(error) return { validationError: error.details[0].message };

    try {
        const clientInfo = {
            name: body.name,
            phone: body.phone
        }
        const client = new Client(clientInfo);
        const result = await client.save();
        debug('Client succesfully created.');
        return result;
    }

    // mongo validation errors
    catch (ex) {
        let errorMessage = "";
        for (fields in ex.errors)              
            errorMessage = errorMessage + ex.errors[fields];
            debug(errorMessage);
            return { error: errorMessage }
    }
}


// @desc    function used in route PUT api/clients/:id
// @return  promise with the updated element as result
async function updateClientById(id, body) {
    
    // obtain the data and InputVal with Joi
    const { error } = validate(body);
    if(error) return { validationError: error.details[0].message };

    // get client buy id return null if not found
    try {
        const client = await Client.findById(id);
        debug('Client found by id.');
        client.name = body.name;
        client.phone = body.phone;
        client.isGold = body.isGold;
        const result = await client.save();
        debug('Client updated successfully.');
        return result
    }

    // mongo validation errors
    catch (ex) {
        if(ex.name == 'CastError') return null
        let errorMessage = "";
        for (fields in ex.errors)              
            errorMessage = errorMessage + ex.errors[fields];
            debug(errorMessage);
            return { error: errorMessage }
    }
}


// @desc    function used in route DELETE api/client/:id
// @return  promise with the delete element as result
async function removeClientById(id) {
    
    try {
        const result = await Client.findByIdAndDelete(id);       
        debug('Client deleted process ran successfully...');
        return result
    }
    catch (ex) {
        debug('Error when deleting client.');
        return null
    }

}


module.exports = {
    getClients: getClients,
    getClientById: getClientById,
    createClient: createClient,
    updateClientById: updateClientById,
    removeClientById: removeClientById
}