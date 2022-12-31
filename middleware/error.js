const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
      let error = { ...err };
      error.message = err.message;
      // console.log("error handler: ",err)
      // checking  error code 
      if (err.code === 11000) {
            const message = `Duplicate Field Value Enter`;
            error = new ErrorResponse(message, 400);
      }; 

      // check here validation error if the validation error map the error value or send to the error
      if (err.name === "ValidationError") {
            const message = Object.values(err.erros).map((value) => value.message);
            error = new ErrorResponse(message, 400);
      };
      res.status(error.statusCode || 500).json({
            sucess: false,
            error: error.message || "Server Error "
      });
};

module.exports = errorHandler;