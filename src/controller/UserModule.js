const bcrypt = require('bcryptjs');
const User = require('../models/User');

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
      const user = await User.find({ email }).select('-__V');
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  async findByEmail(email) {
    try {
      return await User.find({ email }).select('-__V');
    } catch (err) {
      return null;
    }
  },
};

module.exports = UserModule;
