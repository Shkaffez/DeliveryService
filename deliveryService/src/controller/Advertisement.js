const mongoose = require('mongoose');
const Advertisement = require('../models/Advertisement');
const mongoErrorHandler = require('../utils/mongoErrorHandler');
const User = require('../models/User');

const AdvertisementModule = {
  async find(params) {
    const {
      shortText,
      description,
      userId,
      tags,
    } = params;
    let filters;
    if (shortText) {
      filters.shortText = { $regex: shortText };
    }
    if (description) {
      filters.description = { $regex: description };
    }
    if (userId) {
      filters.userId = userId;
    }
    if (tags && tags.length) {
      filters.tags = tags;
    }

    try {
      return await Advertisement.find({
        isDeleted: false,
        ...filters,
      }).select('-__v');
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  async create(data) {
    const {
      shortText,
      description,
      images,
      userId,
      createdAt,
      updatedAt,
      tags,
    } = data;
    const _id = mongoose.Types.ObjectId();
    const newAdvertisement = new Advertisement({
      _id,
      shortText,
      description,
      images,
      userId,
      createdAt,
      updatedAt,
      tags,
    });
    try {
      await newAdvertisement.save();
      const adv = await Advertisement.findById(_id);
      const name = await User.findById(adv.userId);
      return {
        id: adv._id,
        shortText: adv.shortText,
        description: adv.description,
        images: adv.images,
        user: {
          id: adv.userId,
          name: name.name,
        },
        createdAt: adv.createdAt,
      };
    } catch (err) {
      console.log(err);
      return mongoErrorHandler(err);
    }
  },
  async remove(id, user) {
    const adv = await Advertisement.findById(id);
    // eslint-disable-next-line
    if (adv.userId.equals(user._id)) {
      await Advertisement.findByIdAndUpdate(id,
        { isDeleted: true },
        { updatedAt: new Date() });
      return { delete: 'success' };
    }
    throw new Error('you are not auhor of this advertisement');
  },
};

module.exports = AdvertisementModule;
