// Auth Routers

// Controller functions and middlewares.
const {register, login, userProfile, logout, imageUpload, forgotPassword, resetPassword, userEdit} = require("../controllers/auth.js");
const {getAccessToRoute} = require("../middlewares/authorization/auth.js");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload.js");

/* Express router. */
const express = require("express");
const router = express.Router();

/**
api/auth/register 
This route is for user registration. The "register" controller creates a user based on information from client side.
**/
router.post('/register', register);

/**
api/auth/login
This route is for user login. The "login" controller controls take the information from the user and perform the registration process.
**/
router.post('/login', login);

/**
api/auth/:user_id
This route is for the profile information of the user whose ID is entered. 
Before the user can go to their profile, the "getAccessToRoute" interface runs, which performs the session check.
Then the "userProfile" controller runs, which returns the user information.
**/
router.get('/profile', getAccessToRoute, userProfile);

/**
api/auth/logout
This route is for user exit. The "getAccessToRoute" middleware performs the user login check by decoding the JSON Web Token information and allowing the next controller to pass if the token 
information is valid. "logout" controls perform user logout.
**/
router.get('/logout', getAccessToRoute, logout);

/**
api/auth/forgotpassword
This route is for forgot password. It won't run a middleware because the user isn't logged in. The "forgotPassword" controller is for password reset.
**/
router.post('/forgotpassword', forgotPassword);

/**
api/auth/resetpassword
This route is for reset password. It won't run a middleware because the user isn't logged in. The "resetPassword" controller is for password reset.
**/
router.put('/resetpassword', resetPassword);

/**
api/auth/upload
This route is for user to upload profile photo. 
The "getAccessToRoute" middleware performs the user login check by decoding the JSON Web Token information and allowing the next controller to pass if the token information is valid.
If the user is logged in, the "profileImageUpload" middleware will run and the user can upload a single image. 
Then the "imageUpload" controller runs, which saves the image uploaded by the user to the database.
**/
router.post('/upload', [getAccessToRoute, profileImageUpload.single("profile_image")], imageUpload);

/**
api/auth/userEdit
This route is for the user to edit their information. The "getAccessToRoute" middleware performs the user login check by decoding the JSON Web Token information and allowing the next controller to pass 
if the token information is valid. The "userEdit" controller updates the user information according to the information entered by the user.
**/
router.put('/userEdit', getAccessToRoute, userEdit)

module.exports = router;