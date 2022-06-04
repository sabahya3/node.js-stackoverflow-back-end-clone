// Admin Routers

const express = require("express");
const {getAccessToRoute, getAccessAdmin} = require("../middlewares/authorization/auth.js");
const {checkUserExist} = require("../middlewares/database/databaseHelpers.js");
const {blockUser, deleteUser} = require("../controllers/admin.js");
const router = express.Router();

/* 
api/admin 
*/
router.use([getAccessToRoute, getAccessAdmin]);

/* 
api/admin/ 
This route returns a simple message. It is open to Admin access only.
*/
router.get('/', (req, res, next)=> {
       res.status(200).json({
           success: true,
           message: "Admin page for only admins."
       });
})

/*
api/admin/block/:id
This route is for admin to block a user. The "checkUserExist" middleware runs, which checks the user existence first. 
Then the "blockUser" controller runs, which blockes the user if there is one.
*/
router.get('/block/:id', checkUserExist, blockUser);

/*
api/admin/user/:id
This route is for admin to delete a user. The "checkUserExist" middleware runs, which checks the user existence first. 
Then the "deleteUser" controller runs, which deletes the user if there is one.
*/
router.delete('/delete/:id', checkUserExist, deleteUser)

module.exports = router;
