const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { User } = require("./User");

// Use env port or default
const port = process.env.PORT || 8000;

//initialize app
const app = express();

//under normal circumstances, store this in a git-ignored config file or environment variable
const DB_URI = "";

//connect to db
mongoose.connect(process.env.DB_URI || DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connected");
});
connection.on("error", (error) => console.log("Error: " + error));

//morgan used for logging HTTP requests to the console
app.use(morgan("dev"));

//bodyParser middleware used for resolving the req and res body objects (urlEncoded and json formats)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//add simple routes
app.post("/addUser", async (req, res) => {
  try {
    const { name, email } = req.body;

    await User.create({ name, email });

    return res.json({ message: "Successfully created user." });
  } catch (error) {
    return res.json({ message: error });
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ message: `${user.name}, ${user.email}` });
    } else {
      return res.json({ message: "User could not be found." });
    }
  } catch (error) {
    return res.json({ message: error });
  }
});

//start the server
app.listen(port, () => console.log(`Server now running on port ${port}!`));
