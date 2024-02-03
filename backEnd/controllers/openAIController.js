const asyncHandler = require("express-async-handler");
const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

//----OpenAI Controller----

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.body; //  const prompt = req.body.prompt
  console.log(prompt);
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "gpt-3.5-turbo-instruct",
        prompt,
        max_tokens: 10, // nuber of the content
      },
      {
        headers: { // authorization header
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    //send the response
    const content = response?.data?.choices[0].text?.trim(); // without \n and select the first choice
    console.log(content);
    //Create the history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content, // same as content: content,
    });
    //Push the content into the user
    const userFound = await User.findById(req?.user?.id);
    userFound.contentHistory.push(newContent?._id); // contentHistory in user object is a list, we only push the id of the contenthistory
    //Update the api Request count
    userFound.apiRequestCount += 1; // user model
    await userFound.save();
    res.status(200).json(content);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  openAIController,
};