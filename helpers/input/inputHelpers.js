// Input Helpers

const bcrypt = require("bcryptjs");

/* This function checks whether the user has sent the mail and password while the user is logging in. */ 
const validateUserInput = (email, password) => {

    return (
        email && password
    );

};

/* This function compares the hashed password in the database with the password sent by the user during login and checks its correctness. */
const comparePassword = (password, hashedPassword) => {
  
    return bcrypt.compareSync(password,hashedPassword);

};

module.exports = {
    validateUserInput,
    comparePassword,
};

