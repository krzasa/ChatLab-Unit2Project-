const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  body: String,
});


const Room = mongoose.model('Room', roomSchema)
module.exports = Room;