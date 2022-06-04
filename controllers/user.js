// User Controllers

const User = require("../models/User.js");
const asyncErrorWrapper = require("express-async-handler");

/* This controller returns all users. */
const getAllUsers = asyncErrorWrapper( async (req, res, next)=> {

    const users = await User.find();
    
    /* JSON information */
    return res.status(200).json({
        success: true,
        data: users
    });

});

/* This controller returns single users. */
const getSingleUser = asyncErrorWrapper( async (req, res, next)=> {

      const {id} = req.params;
      const user = await User.findById(id);

      /* JSON information */
      return res.status(200).json({
          success: true,
          data: user
      });

});

module.exports = {
    getAllUsers,
    getSingleUser
}