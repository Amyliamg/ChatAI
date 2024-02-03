const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//------Registration-----
const register = asyncHandler(async (req, res) => {  // with asyncHandler, we dont need to write try and catch. It will catch the errot and print it by itself
  const { username, email, password } = req.body;
  //Validate
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please all fields are required");
  }
  //Check the email is taken
  const userExists = await User.findOne({ email });  // return boolean
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //Hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create the user
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });
  //Add the date the trial will end
    // user data model will have the property called trialPeriod

  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );

  //Save the user and wait it until it is saved 
  await newUser.save();
  res.json({
    status: true,
    message: "Registration was successfull",
    user: {
      username,  // just send user name and the email
      email,
    },
  });
});

 



//------Login---------
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  //check if password is valid
  const isMatch = await bcrypt.compare(password, user?.password);// optional chaining if we have user, then grab the password
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  //Generate token (jwt)
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, { // in Mongoose, id is added by default
    expiresIn: "3d", //token expires in 3 days
  });
  console.log(token);

  //set the token into cookie (http only)
  res.cookie("token", token, { // Set-Cookie:
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1 day
  });

  //send the response
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login success",
    username: user?.username, //if user, then grab the username
    email: user?.email,
  });
});
//------Logout-----
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });      // force the token to be cleaned out by setting the token = {} and expire cookie immediately
  res.status(200).json({ message: "Logged out successfully" });
});
//------Profile-----
const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?.id)
    .select("-password")
    .populate("payments")
    .populate("contentHistory"); // with populate, we could see the information in those two objects, like the amount under the payment instead of just seeing the payment-id
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
//------Check user Auth Status-----
const checkAuth = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});


module.exports = {
  register,   //controller
  login,
  logout,
  userProfile,
  checkAuth,
};