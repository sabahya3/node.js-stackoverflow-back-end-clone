// Profile Image Upload Middleware

/* Multer package is used for file and image upload operations. Allows uploading single and multiple files. 
This middleware is written for single image upload purposes. User can upload profile photo with this middleware. */

const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError.js");

/* "storage" specifies where to load the file. It contains two properties named "destination" and "filename". These properties have "req, file, callback" parameters. */
const storage = multer.diskStorage({
    destination: function(req, file, cb){

        const rootDir = path.dirname(require.main.filename);
        cb(null, path.join(rootDir, "public/uploads"));
    
    },

    filename: function(req, file, cb){

        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + extension;
        cb(null, req.savedProfileImage);

    }
});

/* "fileFilter" specifies which types of files can be uploaded. */
const fileFilter = (req, file, cb) => {
    let allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"]

    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("Please provide a valid image file", 400), false)
    }
    return cb(null, true);

};

/* These are exported thanks to the "multer({})" method. */
const profileImageUpload = multer({storage, fileFilter});

module.exports = profileImageUpload;