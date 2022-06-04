// Answer Routers

/* Middlewares and Controllers. */
const {getAccessToRoute, getAnswerOwnerAccess} = require("../middlewares/authorization/auth.js");
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseHelpers.js");
const {addNewAnswerToQuestion, getAllAnswersByQuestion, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, undoLikeAnswer} = require("../controllers/answer.js");

/* Express router. */
const express = require("express");
const router = express.Router({mergeParams:true});

/* 
api/questions/:question_id/answers
*/ 
router.post('/', getAccessToRoute, addNewAnswerToQuestion);

/* 
api/questions/:question_id/answers 
*/ 
router.get('/', getAllAnswersByQuestion);

/* 
api/questions/:question_id/answers/:answer_id 
This route first runs the "checkQuestionAndAnswerExist" middleware which looks for the question and answer on the parameters. 
If there is a question and an answer, then the "getSingleAnswer" controller that brings the answer works.
*/ 
router.get('/:answer_id', checkQuestionAndAnswerExist, getSingleAnswer);

/* 
api/questions/:question_id/answers/:answer_id/like 
This route first runs the "checkQuestionAndAnswerExist" middleware which looks for the question and answer on the parameters.
Then the "getAccessToRoute" middleware runs, which checks if the user is logged in. If the user is logged in, the "likeAnswer" controller works.
*/
router.get('/:answer_id/like', [checkQuestionAndAnswerExist, getAccessToRoute], likeAnswer);

/* 
api/questions/:question_id/answers/:answer_id/undolike 
This route first runs the "checkQuestionAndAnswerExist" middleware which looks for the question and answer on the parameters.
Then the "getAccessToRoute" middleware runs, which checks if the user is logged in. If the user is logged in, the "undoLikeAnswer" controller works.
*/
router.get('/:answer_id/undolike', [checkQuestionAndAnswerExist, getAccessToRoute], undoLikeAnswer);

/* 
api/questions/:question_id/answers/:answer_id/edit
This route first runs the "checkQuestionAndAnswerExist" middleware which looks for the question and answer on the parameters. 
Then the "getAccessToRoute" middleware runs, which checks if the user is logged in. 
If the user is logged in, the migration is allowed, but this time the "getAnswerOwnerAccess" middleware will run, which will check that the issue to be edited is not theirs. 
If the answer belongs to the user, the "editAnswer" controller works, where the user can edit the answer.
*/
router.put('/:answer_id/edit', [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer);

/* 
api/questions/:question_id/answers/:answer_id/delete 
This route first runs the "checkQuestionAndAnswerExist" middleware which looks for the question and answer on the parameters. 
Then the "getAccessToRoute" middleware runs, which checks if the user is logged in. 
If the user is logged in, the migration is allowed, but this time the "getAnswerOwnerAccess" middleware will run, which will check that the issue to be edited is not theirs.
If the answer belongs to the user, the "deleteAnswer" controller works, where the user can delete the answer.
*/
router.delete('/:answer_id/delete', [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer);

module.exports = router;