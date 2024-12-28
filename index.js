// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3004;
const uri = process.env.MONGO_URI;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// MongoDB connect
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Blog Schema
const blogSchema = {
  title: { type: String, required: true },
  post: { type: String, required: true },
};

// Create Blog model
const Blog = mongoose.model("Blog", blogSchema);

// Static content for pages
const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo...";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper...";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum...";

// Routes

// Home 
app.get("/", async function (req, res) {
  try {
    const posts = await Blog.find();
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error("Error fetching blogs from MongoDB:", err);
    res.status(500).send("Error fetching blogs.");
  }
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

app.post("/compose", async function (req, res) {
  const title = _.startCase(req.body.postTitle);
  const content = req.body.postBody; 
  // create new blog post
  const newBlog = new Blog({
    title: title,
    post: content,
  });

  try {
    // save blog to database
    const result = await newBlog.save();
    console.log("Note Saved: ", result);
    res.redirect("/");
  } catch (err) {
    console.error("Error while saving the note:", err);
    res.status(500).send("Error saving the blog post.");
  }
});


app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  const getPostById = async (postId) => {
    try {
      const post = await Blog.findById(postId);
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
});


// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });    


module.exports = app;                                                       