//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");
require("dotenv").config()

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

//blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, require: true },
  post: { type: String, require: true },
});
//create Schema
const Blog = new mongoose.model("Blog", blogSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



let posts = [];

app.get("/", function (req, res) {
  //fetch all data from the database
  const fetchAllBlogs = async () => {
    try {
      posts = await Blog.find();
      // console.log(posts)
    } catch (err) {
      console.log("got error fetching all blogs: ", err);
    }
  };
  fetchAllBlogs();
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // console.log("title: "+req.body.postTitle+" content: " + req.body.postBody)
  //   const title = _.lowerCase(req.body.postTitle)
  //   const content = _.lowerCase(req.body.postBody)
  const title = req.body.postTitle.toLowerCase().replace(/\s+/g, "");
  const content = req.body.postBody.toLowerCase().replace(/\s+/g, "");
  console.log("title: " + title + " content: " + content);
  const saveBlog = async () => {
    const blog = new Blog({
      title: title,
      post: content,
    });

    try {
      const result = await blog.save();
      console.log("Note Saved: ", result);
    } catch (error) {
      console.log("Error while saving the note: ", err);
    }
    // posts.push(post);
  };
  saveBlog();
  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  const getPostById = async (postId) => {
    try {
      const post = await Blog.findById(postId); // Fetch by ID
      if (post) {
        console.log("Post found:", post);
        res.render("post", { title: post.title, content: post.post });
      } else {
        console.log("Post not found");
      }
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  };
  getPostById(requestedId);
  // res.send("hello")
});

// app.listen(3000, function () {
//   console.log("Server started on port 3000");
// });

module.exports = app;                                                                 