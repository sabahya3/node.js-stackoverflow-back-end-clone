// Answer Model

const mongoose = require("mongoose");
const Question = require("./Question.js");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    /** Answer model has a content field. Its type is string. Content is required and must be a minimum of 10 characters. **/ 
    content: {
        type: String, 
        required: [true, "Please provide a content"],
        minlength: [10, "Please provide minimum 10 character"]
    },

    /** Answer model has a createdAt field. Its type is date and gets the current time by default. **/ 
    createdAt: {
        type: Date,
        default: Date.now,
    },

    /** Answer model has a likes field. Its type is objectId and gets "User" as a reference. **/ 
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],

    /** Answer model has a user field. Its type is objectId and gets "User" as a reference. "user" field is required. **/  
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        }
    ],

    /** Answer model has a question field. Its type is objectId and gets "Question" as a reference. "question" field is required. **/ 
    question: {
        type: mongoose.Schema.ObjectId,
        ref: "Question",
        required: true,
    },
});

/** This set of code is called Mongoose Hooks. After the answer is created, it adds this answer to the question it belongs to. **/ 
AnswerSchema.pre("save",async function(next){

    if (!this.isModified("user")) return next();

    /* Try */
    try {
        const question = await Question.findById(this.question);

        question.answers.push(this.id);
   
        await question.save();
        next();
    }
    /* Catch error */
    catch(err) {
        next(err);
    };
 
});

module.exports = mongoose.model("Answer", AnswerSchema)