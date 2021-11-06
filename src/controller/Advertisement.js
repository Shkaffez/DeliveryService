const advertisementModel = require('../models/Advertisement');

const Advertisement = {
  async find(params) {
    const {
      shortText,
      description,
      userId,
      tags,
    } = params;
    try {
      return await advertisementModel.find({
        isDeleted: true,
        shortText: { $regex: shortText },
        description: { $regex: description },
        userId,
        taga: { $all: tags },
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};

module.exports = Advertisement;
