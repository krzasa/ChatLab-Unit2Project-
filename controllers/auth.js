const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

// sign in with bigolkielbasa and test@email.com
router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const userInDatabase = await User.findOne({ name: req.body.name });
  console.log(userInDatabase.name);
  //bigolkielbasa
  if (!userInDatabase.name) {
    return res.send("Login failed. Please try again.");
  }

  

  // There is a user  Time to make a session!
  
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.name,
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