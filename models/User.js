// User Model

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question = require("./Question.js");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
     /** User model has a name field. Its type is string. "name" is required. **/ 
     name : {
         type: String,
         required: [true, "Please provide a name"]
     },
     /** User model has a email field. Its type is string. "email" is required and must be unique. It has regular expression querying for extensions. **/ 
     email: {
         type: String,
         required: true,
         unique: true,
         match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid e-mail"
         ]
     },    
     /** User model has a role field. Its type is string. "role" is required and it's "user" as default. There may be an optional admin role, but this can only be provided by the database
     administrator. **/ 
     role: {
         type: String,
         default: "user",
         enum: ["user", "admin"],
     },
     /** User model has a password field. Its type is string. "email" is required and must be a minimum of 6 characters. By default, the select property is false. **/ 
     password: {
         type: String,
         required: [true, "Please provide a password"], 
         minlength: [6, "Please provide a password longer than your input"],
         select: false,
     },

     /** User model has a createdAt field. Its type is date and gets the current time by default.**/
     createdAt: {
         type: Date,
         default: Date.now
     },

     /** User model has a title field. **/
     title: {
         type: String
     },

     /** User model has a about field. **/
     about: {
         type: String
     },

     /** User model has a place field. **/
     place: {
         type: String
     },

     /** User model has a website field. **/
     website: {
         type: String
     },

     /** User model has a profile_image field. If the user does not upload a profile photo, a photo is defined by the system by default. **/
     profile_image: {
         type: String,
         default: "default.jpg"
     },
     
     /** User model has a blocked field. Its type is boolean and by default the user is not blocked. **/
     blocked: {
         type: Boolean,
         default: false
     },

     /** User model has a resetPasswordToken field. This is for password reset. **/
     resetPasswordToken: {
         type: String,
     },

     /** User model has a resetPasswordExpire field. This is for password reset expire. **/
     resetPasswordExpire: {
         type: Date
     }

});

/*This method creates a token from the user model using the "jsonwebtoken" package.
The "jsonwebtoken" package has the "jwt.sign()" function to generate tokens, and this function takes payload, secret key and options information as parameters.
*/
UserSchema.methods.generateJwtFromUser = function(){

    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;

    const payload = {
        id: this.id,
        name: this.name,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });
    
    /*Return token to use.*/
    return token;
    
};

/*This method is for password reset operations.*/ 
UserSchema.methods.getResetPasswordToken = function() {
    const {RESET_PASSWORD_EXPIRE} = process.env; 

    /*Node.js has the "crypto" package in it and encryption operations are done.*/ 
    const randomHexString = crypto.randomBytes(15).toString("hex");

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    /*Return "resetPasswordToken" to use.*/
    return resetPasswordToken;
};

/* This method takes the user's password just before the user registers and encrypts that password. Sends the encrypted password to the database. */
UserSchema.pre("save", function(next){
     /* This method will not work if the user password has not changed. */
     if(!this.isModified("password")){
         next();
     }  

     /* The "bcryptjs" package is used for encryption operations. */
     bcrypt.genSalt(10, (err,salt)=> {
         if(err) next(err);

        bcrypt.hash(this.password, salt, (err, hash)=> {

         if(err) next(err);
         this.password = hash;
         next();

         });
     });
});

/* After the user is deleted, it also deletes the user's questions. */
UserSchema.post("remove", async function(){
        await Question.deleteMany({
          user: this._id
        }) 
});

module.exports = mongoose.model("User", UserSchema);