const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  author: {
    type: mongoose.ObjectId,
    required: true,
  },
  sendAt: {
    type: Date,
    require: true,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
  },
});

module.exports = model('Message', messageSchema);
