// Answer Controllers

const Question = require("../models/Question.js");
const Answer = require("../models/Answer.js");
const CustomError = require("../helpers/error/CustomError.js");
const asyncErrorWrapper = require("express-async-handler");

/* This controller adds a new answer to a question. */
const addNewAnswerToQuestion = asyncErrorWrapper(async (req,res,next) => {

      /* "question_id" as a parameter */
      const {question_id} = req.params;

      /* The id of the user who added a reply comes as a parameter. */
      const user_id = req.user.id;
      
      /* Information from req.body is kept as "information". */
      const information = req.body;
      
      /* Answer information is formed and user-question information is created. */
      const answer = await Answer.create({
          ...information,
          question: question_id,
          user: user_id
      });
      
      /* JSON information */
      res.status(200)
      .json({
          success : true,
          data : answer
      });
  
});

/* This controller returns the answers based on the id of the question. */
const getAllAnswersByQuestion = asyncErrorWrapper(async (req,res,next) => {
    
     /* "question_id" as a parameter */
    const {question_id} = req.params;
    
    // Question ID'ye göre bulunur ve içindeki answers arrayi bir değişkene atanır.
    // populate("answers") answers'ların tüm bilgilerini getirir. Bu olmasaydı sadece id'lerini getiriyor olacaktı.
    const question = await Question.findById(question_id).populate("answers");
    const answers = question.answers;
    
    /* JSON information */
    return res.status(200).json({
        success: true,
        // Answers arrayının uzunluğu bulunur. Kaç cevap olduğu aranır.
        count: answers.length,
        data: answers
    });
    
});

/* getSingleAnswer controller. */
const getSingleAnswer = asyncErrorWrapper(async (req,res,next) => {

      const {answer_id} = req.params;
      const answer = await Answer
      .findById(answer_id)
      .populate({
          path: "question",
          select: "title"
      })
      .populate({
          path: "user",
          select: "name profile_image"
      });

      /* JSON information */
      return res.status(200).json({
          success: true,
          data: answer
      })
    
});

/* editAnswer controller. */
const editAnswer = asyncErrorWrapper(async (req,res,next) => {

      const {answer_id} = req.params;
      const {content} = req.body;

      let answer = await Answer.findByIdAndUpdate(answer_id);
      answer.content = content;

      /* Save the answer. */
      await answer.save();

      /* JSON information */
      return res.status(200).json({
          success: true,
          data: answer
      })

});

/* deleteAnswer controller. */
const deleteAnswer = asyncErrorWrapper(async (req,res,next) => {

    const {answer_id} = req.params;
    const {question_id} = req.params;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id);
    question.answers.splice(question.answers.indexOf(answer_id, 1));

    /* Save the question. */
    await question.save();

    /* JSON information */
    return res.status(200).json({
        success: true,
        message: "Answer deleted successfully."
    });

});

/* likeAnswer controller. */
const likeAnswer = asyncErrorWrapper(async (req,res,next) => {

    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);

    /* An error message is returned if the user has already liked the question. */
    if(answer.likes.includes(req.user.id)){
        return next(new CustomError("You already liked this question."), 400)
    };
    
    /* If the user didn't like the answer, they can now like it. */
    answer.likes.push(req.user.id);

    /* Save the answer. */
    await answer.save();

    /* JSON information */
    return res.status(200).json({
        success: true,
        message: answer,
    })

});

/* undoLikeAnswer controller. */
const undoLikeAnswer = asyncErrorWrapper(async (req,res,next) => {

    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);

    /* If the user doesn't like the answer already, they will get an error message. */
    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError("You can't undo like operation for this answer"), 400)
    };
    
    const index = answer.likes.indexOf(req.user.id);

     /* User information is removed from the likes array. */
    answer.likes.splice(index, 1);

    /* Save the answer. */
    await answer.save();

    /* JSON information */
    return res.status(200).json({
        success: true,
        message: answer,
    });

});

module.exports = {
    addNewAnswerToQuestion, 
    getAllAnswersByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer
};