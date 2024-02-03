const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
require("./utils/connectDB")();
require("dotenv").config(); // let the dotenv use in this document
const { errorHandler } = require("./middlewares/errorMiddleware");
const usersRouter = require("./routes/usersRouter");
const openAIRouter = require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
const asyncHandler = require("express-async-handler");

const PORT = process.env.PORT || 8090

//Cron for the trial period : run every single
// 1. second 0-59
// 2. min 0-59
// 3. hour 0-23
// 4. date of month  1-31
// 5. month  1-12
// 6. date of week 0-6, 0 is sunday
// ****** = every second
// 0 0  * * * * = every single day

cron.schedule("0 0 * * * *", async () => {
    console.log("This task runs every second");
    try {
      //get the current date
      const today = new Date();
      const updatedUser = await User.updateMany(
        {
          trialActive: true,
          trialExpires: { $lt: today },// less than today
        },
        { // check the account whether it is trialactive + expire, if so, then change the data to the below
          trialActive: false,
          subscriptionPlan: "Free",
          monthlyRequestCount: 5,
        }
      );
      console.log(updatedUser);
    } catch (error) {
      console.log(error);
    }
  });

  //Cron for the Free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    try {
      //get the current date
      const today = new Date();
      await User.updateMany(
        {
          subscriptionPlan: "Free",
          nextBillingDate: { $lt: today },
        },
        {
          monthlyRequestCount: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });


//Cron for the Basic plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    try {
      //get the current date
      const today = new Date();
      await User.updateMany(
        {
          subscriptionPlan: "Basic",
          nextBillingDate: { $lt: today },
        },
        {
          monthlyRequestCount: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  
  //Cron for the Premium plan: run at the end of every month
  cron.schedule("0 0 1 * * *", async () => {
    try {
      //get the current date
      const today = new Date();
      await User.updateMany(
        {
          subscriptionPlan: "Premium",
          nextBillingDate: { $lt: today },
        },
        {
          monthlyRequestCount: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  //Cron paid plan

//----middlewares----often place before the call request
app.use(express.json()); //pass incoming json data
app.use(cookieParser()); //pass the cookie automatically
const corsOptions = {  // trust the frontend
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));


//----Routes-----
app.use("/api/v1/users", usersRouter); // if api call this url, then we use usersRouter to handle the request
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);



//---Error handler middleware----
app.use(errorHandler);



// server starts
app.listen(PORT, console.log(`Server is running on the port ${PORT}`))
