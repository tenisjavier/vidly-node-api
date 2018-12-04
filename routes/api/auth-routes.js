// @desc    auth routes
// @func    log in the users
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth-api');


// @desc    login a user return token with payload of id and isAdmin
// @access  public
router.post('/', async (req, res) => {
    
    const result = await authController.login(req.body);
    if(result.error) return res.status(400).send(result.error);
    res.send(result);

});


module.exports = router;