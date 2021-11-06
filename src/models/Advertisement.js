const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const advertisementSchema = new Schema({
  emshortTextail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
  },
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },

});

module.exports = model('Advertisement', advertisementSchema);
