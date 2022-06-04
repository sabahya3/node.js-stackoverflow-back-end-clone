// Question Controllers

const Question = require("../models/Question.js"); // Question modeli dahil edilir.
const CustomError = require("../helpers/error/CustomError.js");
const asyncErrorWrapper = require("express-async-handler"); // Express-async-handler paketi.

/* Ask New Question This controller creates a new question. */
const askNewQuestion = asyncErrorWrapper (async (req, res, next) => {
      
      /* Question information is taken from "req.body". */
      const information = req.body;

      /* This is where the question creation process takes place. */
      const question = await Question.create({

          /* "information" information with spread operator. */
          ...information,
          
          /* The information of the user who created the question is taken from "req.user.id" */
          user: req.user.id,
      });

      /* JSON information */
      res.status(200).json({
          success: true,
          data: question,
      });
});

/* Get All Questions. This controller returns all questions. */
const getAllQuestions = asyncErrorWrapper (async (req, res, next) => {
    
    /* The "question" image finds and returns all the questions from the database. */ 
    const questions = await Question.find();
 
    /* JSON information */
    return res.status(200).json({
        success: true,
        data: questions,
    });
});

/* Get Single Question. This controller returns a single question by parameter. */ 
const getSingleQuestion = asyncErrorWrapper (async (req, res, next) => {
    
    const {id} = req.params;
    const question = await Question.findById(id);

    /* JSON information */
    return res.status(200).json({
        success: true,
        data: question,
    });
});

/* Edit Question */
const editQuestion = asyncErrorWrapper (async (req, res, next) => {
    
    // Id parametresi
    const {id} = req.params;
    // Değiştirilecek bilgiler:
    const {title, content} = req.body;
    
    // Question bilgisi alınır instance olarak alınır.
    let question = await Question.findById(id);

    // Yeni title ve content.
    question.title = title;
    question.content = content;

    question = await question.save();

    /* JSON information */
    return res.status(200)
    .json({
        success: true,
        data: question,
    })
});

/* Delete Question */
const deleteQuestion = asyncErrorWrapper (async (req, res, next) => {
    
    // Id'yi alırız.
    const {id} = req.params;
    // Değiştirmek istediğimiz bilgileri req.body'den alırız.
   
    await Question.findOneAndDelete(id);

    /* JSON information */
    res.status(200).json({
        success: true,
        message: "Your Question was deleted."
    });

});

/* Like Question */
const likeQuestion = asyncErrorWrapper (async (req, res, next) => {
    
      const {id} = req.params;
      const question = await Question.findById(id);

      /* Control of likes */
      if(question.likes.includes(req.user.id)){
          return next(new CustomError("You already liked this question."))
      };

      question.likes.push(req.user.id);
      
      /* Push to likes array */
      await question.save();
     
      /* JSON information */
      return res.status(200).json({
          success: true,
          data: question
      })
});

/* Undolike Question */
const undoLikeQuestion = asyncErrorWrapper (async (req, res, next) => {
    
    const {id} = req.params;
    const question = await Question.findById(id);

    // Kullanıcı beğenenler arasında değilse hata mesajı dönülür:
    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("You cant undo like operation for this question."));
    };

    // Like etmişse kullanıcı id'si index'si bularak like kaldırılır.
    const index = question.likes.indexOf(req.user.id);

    // Splice likes dizisinden kullanıcı bilgisini kaldırır.
    question.likes.splice(index, 1)
    // Question'u kaydet.
    await question.save()
    
    /* JSON information */
    return res.status(200).json({
        success: true,
        data: question
    })
});

module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
}