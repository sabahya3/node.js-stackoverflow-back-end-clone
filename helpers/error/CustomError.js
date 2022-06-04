/* The "CustomError" class is derived from the "Error" class and is written to send a custom error message to the user. 
Along with the "CustomError" class, the error status code can be sent as a response, as well as the error message. */

class CustomError extends Error {
    /* constructor function */
    constructor(message, status) {
        super(message);
        this.status = status;
    };
};

module.exports = CustomError;