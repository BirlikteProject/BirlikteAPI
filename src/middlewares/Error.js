
const ErrorResponse = require("../scripts/utils/ErrorResponse");


const errorHandler = (err, req, res, next) => {

  
  let error = { ...err };

  error.message = err.message;


  if (err.code === 11000) {
    const message = "Yinelenen değeri girdiniz. Tekrar deneyiniz.";

    error = new ErrorResponse(message, 400);
  } 

  if(err.name === "ValidationError"){
      const message = Object.values(err.errors).map((val)=> {val.message;});
      error = new ErrorResponse(message,400);
  }

  res.status(error.statusCode || 500).json({
      status: false,
      message : error.message || "Server Error",
      data:null
  })

};

module.exports = errorHandler;
