// Middlewares

const CustomError = require("../../helpers/error/CustomError.js");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User.js");
const Question = require("../../models/Question.js");
const Answer = require("../../models/Answer.js");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers.js");

/* This middleware checks if the user has a token and if the user has a token it decodes it. The "jwt.verify()" function performs the decryption of the token. 
This function belongs to the "jsonwebtoken" package. If the token information can be deciphered, the user information is assigned to "req.user". */
const getAccessToRoute = (req, res, next) => {

      const {JWT_SECRET_KEY} = process.env;

      /*  */
      if(!isTokenIncluded(req)) {
          return next(new CustomError("You are not authorized", 401));
      };

      const access_token = getAccessTokenFromHeader(req);

      jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded)=> {

         if (err){
             return next(new CustomError("You are not authorized", 401))
         };

      req.user = {
          id: decoded.id,
          name: decoded.name
      };  

      next();
      
      });
};

/* This middleware checks if the user's role is admin when requesting the admin route. 
If the user's role is not admin, it will not allow the transition, if the user's role is not admin, it will allow the transition. */
const getAccessAdmin = asyncErrorWrapper ( async (req, res, next) => {
      
    const {id} = req.user;
    const user = await User.findById(id);

    if (user.role !=="admin"){
        return next(new CustomError("Only Admin cans access to route."), 403)
    };
    
    next();

});

/* This middleware checks when the user wants to edit a question whether that question really belongs to the user who wanted to edit the question. */
const getQuestionOwnerAccess = asyncErrorWrapper(async (req,res,next) => {

    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);
    
    if (question.user != userId) {
        return next(new CustomError("Only owner can handle this operation",403));

    }
    return next(); 
});

/* This middleware checks when the user wants to edit an answer, that it actually belongs to the user who wanted to edit the answer. */
const getAnswerOwnerAccess = asyncErrorWrapper(async (req,res,next) => {

    const userId = req.user.id;
    const answerId = req.params.answer_id;

    const answer = await Answer.findById(answerId);
    
    if (answer.user != userId) {
        return next(new CustomError("Only owner can handle this operation",403));

    }
    return next(); 
});

module.exports = {
    getAccessToRoute,
    getAccessAdmin,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess,
};