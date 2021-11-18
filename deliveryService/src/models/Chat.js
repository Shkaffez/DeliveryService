const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const message = require('./Message');

function arrayLimit(val) {
  return val.length === 1;
}

const chatSchema = new Schema({
  users: {
    type: [mongoose.ObjectId],
    required: true,
    validate: arrayLimit,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  messages: {
    type: [message],
  },
});

module.exports = model('Chat', chatSchema);
