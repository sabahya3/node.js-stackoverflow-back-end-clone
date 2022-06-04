// Question Model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// The "slugify" package is for adding slug fields to questions.
const slugify = require("slugify");

const QuestionSchema = new Schema({
      /** Question model has a title field. Its type is string. Title is required and must be a minimum of 5 characters.  **/ 
      title: {
          type: String,
          required: [true, "Please provide a title"],
          minlenght: [5, "Please provide a title at least 10 characters."],
      },

      /** Question model has a content field. Its type is string. Content is required and must be a minimum of 5 characters. **/ 
      content: {
          type: String,
          required: [true, "Please provide a content"],
          minlenght: [5, "Please provide a title at least 20 characters."]
      },

      /** Question model has a slug field. Its type is string. **/
      slug: {
          type: String,
      },

      /** Question model has a createdAt field. Its type is date and gets the current time by default. **/ 
      createdAt: {
          type: Date,
          default: Date.now()
      },

      /** Question model has a user field. Its type is objectId and gets "User" as a reference. "user" field is required. **/  
      user: {
          type: mongoose.Schema.ObjectId,
          required: true,  
          ref: "User",

      /** Question model has a likes field. Its type is objectId and gets "User" as a reference. **/    
      },
      likes: [
          {
              type: mongoose.Schema.ObjectId,
              ref: "User"
          }
      ],

      /** Question model has a answers field. Its type is objectId and gets "Answer" as a reference. **/ 
      answers: [
          {
              type: mongoose.Schema.ObjectId,
              ref: "Answer"
          }
      ]
}, {
    /*"timestamps" adds time information, "versionkey" removes version information.*/ 
    timestamps: true, versionKey: false
});

/* This set of code is called Mongoose Hooks. Adds slug information according to the question title before saving the question.*/
QuestionSchema.pre("save", function(next){
       
       /*If the title information has not changed, it continues without running the following function.*/
       if(!this.isModified("title")){
           next();
       }

       /* Creates a slug. */
       this.slug = this.makeSlug();
       next();

});

/* The slug function was written as a method.*/
QuestionSchema.methods.makeSlug = function() {
    /* "slugify" creates a slug from the string information it contains.*/
    return slugify(this.title, { 
        replacement: '-', // "-"" will include.
        remove: /[*+~.()'"!:@]/g,  // A regular expression that specifies characters that will not be in the slug field.
        lower: true, // Converts all characters to lowercase characters.
    });
};

module.exports = mongoose.model("Question", QuestionSchema);