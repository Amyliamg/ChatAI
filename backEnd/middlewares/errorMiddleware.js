// middleware: modify the request or response objects, end the request-response cycle, or call the next middleware function in the stack

const errorHandler = (err, req, res, next) => {
    // next parameter is a function that, when called, passes control to the next middleware function in the chain.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : {}, // the error will only show if it is in development env
    });
  };
  
module.exports = {
    errorHandler,
  };