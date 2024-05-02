const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require('express-session')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Chat = require("./models/chat.js");
const router = require("./controllers/auth.js");
app.use(express.urlencoded({ extended: false }));
const authController = require("./controllers/auth.js");
app.use(methodOverride("_method"));
app.use(morgan('dev'));



mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });



    // GET	/chat	Read	Display a list of all posts.

  app.get("/", async (req, res) => {
    const allPosts = await Chat.find({});
    res.render('index.ejs', {allPosts, 
    user: req.username,})
    console.log(req.username);
    
  });
  app.use("/auth", authController);

  app.get('/chat', async (req, res)=>{
    const allPosts = await Chat.find({});
    // console.log(allPosts);
    res.render('index.ejs', {allPosts})
  })

// GET	/chat/new	Read	new	Show a form to add a new post.
  app.get("/chat/new", (req, res) => {
    res.render("/chats/new.ejs");
  });
// POST	/blog	Create	create	Add a new post to the list.
app.post('/chat', async (req, res)=>{
  await Chat.create({
      name: req.body['username'],
      message: req.body['message']
  })
  console.log(req.body);
  res.redirect('/chat')
})

// GET	/chat/:id	Read	show	Display a specific post’s details.
app.get('/chat/:id', async (req, res) => {
    const post = await Chat.findById(req.params.id)
    
    res.render('show.ejs', {post})
})

// GET	/chat/:id/edit	Read	edit	Show a form to edit an existing post’s details.
app.get('/chat/:id/edit', async (req, res)=>{
    const post = await Chat.findById(req.params.id)
    res.render('edit.ejs', {post})
})

// PUT	/chat/:id	Update	update	Update a specific post’s details.
app.put('/chat/:id', async (req, res)=>{
    await Chat.findByIdAndUpdate(req.params.id, {
        name: req.body['username'],
        message: req.body['message']
    })
    res.redirect(`/chat`)
})
// DELETE	/chat/:id	Delete	delete	Remove a specific post from the list.
app.delete('/chat/:id', async (req, res)=>{
    await Chat.findByIdAndDelete(req.params.id)
    res.redirect('/chat')
})



app.listen(3010, () => {
    console.log("Listening on port 3010");
  });

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);