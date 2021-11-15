const express = require('express');
const AdvertisementModule = require('../controller/Advertisement');
const Advertisement = require('../models/Advertisement');
const checkAuth = require('../middleware/checkAuth');
const fileMiddlefare = require('../middleware/loadFile');

const router = express.Router();

router.get('/:guery', async (req, res) => {
  console.log(req.query);
  try {
    const data = await AdvertisementModule.find(req.query);
    res.json({
      data,
      status: 'ok',
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
});

router.post('/', checkAuth, fileMiddlefare.array('img'), async (req, res) => {
  const userId = req.user._id;
  const images = [];
  if (req.files) {
    req.files.forEach((file) => {
      images.push(`/uploads/${userId}${file.originalname}`);
    });
  }
  const {
    shortText,
    description,
    tags,
  } = req.body;
  try {
    const data = await AdvertisementModule.create({
      shortText,
      description,
      images,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
    });
    res.json({
      data,
      status: 'ok',
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: 'error',
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Advertisement.findById(id).select('-__v');
    res.json({
      data,
      status: 'ok',
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const data = await AdvertisementModule.remove(id, req.user);
    res.json({
      data,
      status: 'ok',
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err.message });
  }
});

module.exports = router;
