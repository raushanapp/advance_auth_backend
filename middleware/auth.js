const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
      };
      if (!token) {
            return next(new ErrorResponse("Not authorized to acces this route", 401));
      };
      try {
            // here reverse the hash password and verify them if not verify return the error else return response
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decoded.id);
            if (!user) {
                  return next(new ErrorResponse("No user found with this id", 404));
            };
            req.user = user;
            // if go next code or next route ;
            next();
      } catch (error) {
            return next(new ErrorResponse("Not authorized to acces this route", 401)); 
      }
}