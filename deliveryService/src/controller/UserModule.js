const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoErrorHandler = require('../utils/mongoErrorHandler');

const UserModule = {
  async create(data) {
    const {
      email,
      password,
      name,
      contactPhone,
    } = data;
    const hash = bcrypt.hashSync(password, 10);

    const newUser = new User({
      email,
      passwordHash: hash,
      name,
      contactPhone,
    });
    try {
      await newUser.save();
      const user = await User.find({ email }).select('-__v');
      return {
        data: user,
        status: 'ok',
      };
    } catch (err) {
      return mongoErrorHandler(err);
    }
  },

  async findByEmail(email) {
    try {
      return await User.find({ email }).select('-__v');
    } catch (err) {
      return null;
    }
  },
};

module.exports = UserModule;
