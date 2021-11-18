const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const ChatModule = {
  async find([author, receiver]) {
    try {
      return await Chat.find({ $or: [{ users: [author, receiver] }, { users: [receiver, author] }] }).select('-__v');
    } catch (err) {
      console.log(err);
    }
  },

  async sendMessage(data) {
    const { author, receiver, text } = data;
    const _id = mongoose.Types.ObjectId();
    const newMessage = new Message({
      _id,
      author,
      sendAt: new Date(),
      text,
    });
    try {
      const chat = await ChatModule.find([author, receiver]);
      if (!chat) {
        const newChat = new Chat({
          users: [author, receiver],
          createdAt: new Date(),
          messages: [newMessage],
        });
        await newChat.save();
        return await Message.findById(_id).select('-__v');
      }
      chat.messages.push(newMessage);
      await chat.save();
      return await Message.findById(_id).select('-__v');
    } catch (err) {
      console.log(err);
    }
  },

  async getHistory(id) {
    return await Chat.findById(id).select('messages');
  },

};

module.exports = ChatModule;
