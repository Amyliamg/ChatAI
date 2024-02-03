// in express, since we dont call next  in the controller, we need to call the next in middleware
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//----IsAuthenticated middleware
const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) { // if you want to access it, you must Install the cookie-parser package + Use cookie-parser as middleware 
    //! Verify the token
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET); //the actual login user
    // it will return the user id

    //add the user to the req obj
    req.user = await User.findById(decoded?.id).select("-password"); // password field should be excluded from the result, it will return all the data about user exclude the password field

    return next(); // if there is another controller class needs to be call next, then we can call them here. It will not block the process
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = isAuthenticated;