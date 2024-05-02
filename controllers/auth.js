const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


router.post("/sign-in", async (req, res) => {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ name: req.body.name });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }
  
    
    // console.log(req.name);
    // There is a user Time to make a session!
    req.session.user = {
      username: userInDatabase.username,
    };
  
    res.redirect("/");
  });
router.get("/sign-in", (req, res) => {
        res.render("auth/sign-in.ejs");
      });
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });
  
router.post("/sign-up", async (req, res) => {
const userInDatabase = await User.findOne({ name: req.body.name });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }   
    if (req.body.email !== req.body.confirmEmail) {
      return res.send("Password and Confirm Password must match");
    }
// const hashedEmail = bcrypt.hashSync(req.body.email, 10);
//     req.body.email = hashedEmail;
const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.name}`);
    
  
});



module.exports = router;