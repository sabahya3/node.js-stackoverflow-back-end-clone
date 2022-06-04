// Custom Error Handler Middleware

const CustomError = require("../../helpers/error/CustomError")

/* This CustomErrorHandler catches errors sent with next(). It creates a custom response based on the names or error codes of the errors it catches. 
The specific error message contains the description of the error and the status code. It does this thanks to the CustomError class. */
const customErrorHandler = (err, req, res, next) => {
     let customError = err;
    
     if (err.name === "SyntaxError") {
         customError = new CustomError("Unexpected Syntax", 400)
     };
     if (err.name === "ValidationError") {
         customError = new CustomError(err.message, 400)
     };
     if (err.name === "CastError") {
         customError = new CustomError("Please provide a valid ID", 400)
     };
     if (err.code === 11000) {
         customError = new CustomError("Duplicate Key Found: Check Your Input", 400)
     };

     /* Error Response */
     res.status(customError.status || 500).json({
         success: false,
         message: customError.message 
     })
};

module.exports = customErrorHandler;