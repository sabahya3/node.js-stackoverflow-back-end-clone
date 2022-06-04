// Questions Routers

// Controller functions and middlewares.
const {askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion, undoLikeQuestion} = require("../controllers/questions.js"); 
const {getAccessToRoute, getQuestionOwnerAccess} = require("../middlewares/authorization/auth.js"); 
const {checkQuestionExist} = require("../middlewares/database/databaseHelpers.js"); 
const answer = require("./answer.js");
 
/* Express router. */
const express = require("express");
const router = express.Router();

/*
api/questions/
When a request is made to this route, the "getAllQuestions" controller runs, which finds and returns all the questions from the database.
*/
router.get('/', getAllQuestions);

/*
api/questions/:id
When a request is made to this route, the "checkQuestionExist" middleware runs, which queries the database based on the question id sent first. 
If the question sent as a parameter is found, the "getSingleQuestion" controller returns it.
*/
router.get('/:id', checkQuestionExist ,getSingleQuestion);

/*
api/questions/ask
When a request is made to this route, the "getAccessToRotue" middleware runs, which first checks if the user is logged in. 
If the user is logged in, the "askNewQuestion" controller will run, allowing the user to ask questions.
*/
router.post('/ask', getAccessToRoute, askNewQuestion); // Önce token decoded middleware' çalışır, ardından soru ekleme controlleri çalışır.

/*
api/questions/:id/like
When a request is made to this route, the "getAccessToRotue" middleware runs, which first checks if the user is logged in. 
Then the "checkQuestionExist" middleware runs, which queries the database based on the question id sent first.
If the question exists, the "likeQuestion" controller works, where the user can like the question.
*/
router.get('/:id/like', [getAccessToRoute, checkQuestionExist], likeQuestion);

/*
api/questions/:id/undolike
When a request is made to this route, the "getAccessToRotue" middleware runs, which first checks if the user is logged in. 
Then the "checkQuestionExist" middleware runs, which queries the database based on the question id sent first.
If the question exists, the "undoLikeQuestion" controller works, where the user can undolike the question.
*/
router.get('/:id/undolike', [getAccessToRoute, checkQuestionExist], undoLikeQuestion);

/*
api/questions/:id/edit
When a request is made to this route, the "getAccessToRotue" middleware runs, which first checks if the user is logged in. 
Then the "checkQuestionExist" middleware runs, which queries the database based on the question id sent first.
Then the "getQuestionOwnerAccess" middleware runs, which checks if the user is the real owner of the question so that he can edit it.
If the user is the real owner of the question, the "editQuestion" controller works.
*/
router.put('/:id/edit', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);

/*
api/questions/:id/delete
When a request is made to this route, the "getAccessToRotue" middleware runs, which first checks if the user is logged in. 
Then the "checkQuestionExist" middleware runs, which queries the database based on the question id sent first.
Then the "getQuestionOwnerAccess" middleware runs, which checks if the user is the real owner of the question so that he can edit it.
If the user is the real owner of the question, the "deleteQuestion" controller works.
*/
router.delete('/:id/delete', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);

/*
api/questions/:question_id/answers
When a request is made to this route, the "checkQuestionExist" middleware runs, which queries the database based on the question id sent first.
Then, a redirect is made to the "answer" route.
*/
router.use('/:question_id/answers', checkQuestionExist, answer);

module.exports = router;