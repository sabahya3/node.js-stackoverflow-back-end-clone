// Admin Controllers

const User = require("../models/User.js");
const CustomError = require("../helpers/error/CustomError.js");
const asyncErrorWrapper = require("express-async-handler");

/* This controller is for admin to block a user. */
const blockUser = asyncErrorWrapper ( async (req, res, next)=> {
      
      /* The user id comes as a parameter. */
      const {id} = req.params;
      const user = await User.findById(id)

      /* This part sets true if the block info is false. */
      user.blocked = !user.blocked;

      /* Updates user information. */
      await user.save();

      /* JSON information. */
      return res.status(200).json({
          success: true,
          message: "Block - Unblock is Successful"
      });

});

/* This controller is for admin to delete a user. */
const deleteUser = asyncErrorWrapper ( async (req, res, next)=> {
      
      /* The user id comes as a parameter. */
      const {id} = req.params;
      const user = await User.findById(id);

      /* The user is deleted. */
      await user.remove();
      
      /* JSON information. */
      return res.status(200).json({
          success: true,
          message: "Delete Operation Successful"
      });

});

module.exports = {
    blockUser,
    deleteUser
}