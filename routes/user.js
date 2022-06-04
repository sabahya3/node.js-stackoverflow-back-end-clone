// User router file

// Controller functions and middlewares.
const {getAllUsers, getSingleUser} = require("../controllers/user.js");
const {checkUserExist} = require("../middlewares/database/databaseHelpers.js");

/* Express router. */
const express = require("express");
const router = express.Router();

/*
api/users/
When a request is made to this route, the "getAllUsers" controller runs, which retrieves all users from the database.
*/
router.get('/', getAllUsers)

/*
api/users/:id
When a request is made to this route, the "checkUserExist" middleware runs first, which queries the user in the database according to the parameter.
Then the "getSingleUser" controller runs which brings the user.
*/
router.get('/:id', checkUserExist, getSingleUser)

module.exports = router;