const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const options = { cors: { origin: process.env.NODE_EVV === "production" ? false :
["http://localhost:3010"] }  // this keeps the the view only to people who access the node enviornment by the localhost
// tthe question mark is a shortcut for an if statement 
  
}
const io = require("socket.io")(http, options);
const session = require('express-session')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Chat = require("./models/chat.js");
app.set('view engine', 'ejs');
const authController = require("./controllers/auth.js");
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
})
);

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

  io.on('connection', (socket) => {   // This will emit the event to all connected sockets once the connection turns on
  socket.on('chat message', (msg) => {
    
    io.emit('chat message', msg);   // maybe add "req.session.user+ ": " +" before message?
    // console.log(msg+ "test"); returns message test and null test 
  });
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
    
});
});



    
    app.set('views', __dirname + '/views')
    // Set plain HTML as our template engine, which requires EJS
    .engine('html', require('ejs').renderFile)
    // Ensure that the routes below aren't overwritten by static files
    
    
    // GET	/chat	Read	Display a list of all posts.
  app.get("/", async (req, res) => {
    const allPosts = await Chat.find({});
    res.render('index.ejs', {allPosts, 
    user: req.session.user,})
    
    
  });
  
  app.use("/auth", authController)
  

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
  // console.log(req.body);
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


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
http.listen(3010, () => {
    console.log("Listening on port 3010");
  });

