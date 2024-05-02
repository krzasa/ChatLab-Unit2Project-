const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Chat = require("./models/chat.js");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

  app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  // GET	/chat	Read	Display a list of all posts.
app.get('/chat', async (req, res)=>{
    const allPosts = await Chat.find({});
    res.render('index.ejs', {allPosts})
})
// GET	/chat/new	Read	new	Show a form to add a new post.
  app.get("/chat/new", (req, res) => {
    res.render("/chats/new.ejs");
  });
// POST	/chat	Create	create	Add a new post to the list.
app.post('/chat', async (req, res)=>{
    await Chat.create({
        name: req.body['username'],
        message: req.body['message']
    })
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
    console.log("Listening on port 3000");
  });