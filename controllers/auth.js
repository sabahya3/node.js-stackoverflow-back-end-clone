// Auth Controllers

const User = require("../models/User"); // User Model 
const CustomError = require("../helpers/error/CustomError"); // Custom Error
const asyncErrorWrapper = require("express-async-handler"); // Express-async-handler module for handling async error
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers.js"); // Create token and send to client as cookie
const {validateUserInput ,comparePassword} = require("../helpers/input/inputHelpers.js"); // Control email-password ve compare password
const sendMail = require("../helpers/libraries/sendEmail.js");

/* Register controller. This controller creates user and token according to "User" model with information from body.*/
const register = asyncErrorWrapper( async (req,res,next) => {  
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });

    sendJwtToClient(user,res);
});

/* Login Controller */
const login = asyncErrorWrapper ( async (req,res,next) => {

     const {email, password} = req.body;

     if(!validateUserInput(email, password)){
         next(new CustomError("Check Your Inputs"), 404)
     };
 
    const user = await User.findOne({email}).select("+password");
    
    if(!comparePassword(password, user.password)){
        return next(new CustomError("Please Check Your Password", 404))
    };

    sendJwtToClient(user, res);
});

/* Log out Controller */
const logout = asyncErrorWrapper( async (req,res,next) => {

      const {NODE_ENV} = process.env;

      return res.status(200).cookie({
          httpOnly: true,
          expires: new Date(Date.now()),
          secure: NODE_ENV === "development" ? false : true,
      })
      /* JSON information */
      .json({
          success: false,
          message: "Logout is successful"
      })

});

/* User Profile Controller */
const userProfile = asyncErrorWrapper( async (req,res,next) => {
       
    const userId = req.user.id
    const user = await User.findById(userId);
     
    /* JSON information */
    res.status(200).json({
        success: true,
        data: {
            user
        }
    });

}) ;

/* Image Upload Controller */
const imageUpload = asyncErrorWrapper( async (req, res, next)=> {

    /* Image Upload Successfull */
    const user = await User.findByIdAndUpdate(req.user.id, {
        profile_image: req.savedProfileImage
    }, {
        new: true,
        runValidators: true,
    });

    /* JSON information */
    res.status(200).json({
        success: true,
        message: "Image Upload Succesfull",
        data: user
    })

});

/* Forgot Password Controller */
const forgotPassword = asyncErrorWrapper(async (req,res,next) => {

    const resetEmail = req.body.email;
    const user = await User.findOne({email: resetEmail});

    if (!user) {
        return next(new CustomError("User Not Found With That Email",400));

    }
    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();
    
    const resetPasswordUrl = `http://localhost:3000/api/auth/resetPassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a>  will expire in 1 hour</p>
        
    `;
    try {
        await sendMail({
            from: process.env.SMTP_EMAIL, 
            to: resetEmail, 
            subject: "Reset Password Token",
            html: emailTemplate
        });
        
        /* JSON information */
        return res.status(200)
        .json({
            success : true,
            message : "Email Sent To Your Email",
        });
    }
    catch(err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        user.save();

        return next(new CustomError("Email Could Not Be Sent",500));
    }    
});

/* Reset Password Controller */
const resetPassword = asyncErrorWrapper( async (req, res, next) => {
        
      const {resetPasswordToken} = req.query;

      const {password} = req.body;

      if (!resetPassword) {
          return next(new CustomError("Please provide a valid token", 400));
      };

      let user = await User.findOne({
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpire: {$gt: Date.now()}
      });

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      /* JSON information */
      res.status(200).json({
          success: true,
          message: "Reset Password Process Successfull"
      })

});

/* User Edit Controller */
const userEdit = asyncErrorWrapper( async (req, res, next) => {
        
     const editInformation = req.body;
     const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
         new: true,
         runValidators: true,
     });
     
     /* JSON information */
     return res.status(200).json({
         success: true,
         data: user
     })

});
 
module.exports = {
    register,
    login,
    logout,
    userProfile,
    imageUpload,
    forgotPassword,
    resetPassword,
    userEdit
};