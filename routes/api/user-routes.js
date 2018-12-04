// @desc    users API routes
// @func    CRUD functions for the users collection
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user-api');
const _ = require('lodash');
const auth = require('../../middleware/auth-middleware');


// @desc    get the current user info
// @access  private
router.get('/me', auth, async (req, res) => {
    
    const result = await userController.getUserById(req.user._id)
    res.send(result);
    
});

// @desc    insert a new user to the db
// @access  private
router.post('/', async (req, res) => {
    
    const result = await userController.createUser(req.body);
    if(result.validationError) return res.status(400).send(result.validationError);
    const token = result.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(result, ['name', 'email']));

});


module.exports = router;