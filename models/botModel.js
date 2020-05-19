const mongoose = require('mongoose');
// const validator = require('validator');

const BotSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: [true, 'A bot must have a page.'],
    unique: true,
    trim: true,
  },
  pagePassword: {
    type: String,
    required: [true, 'A page must have an password.'],
    trim: true,
  },
  comments: [],
  directTexts: [],
  targetTags: [],
  targetPages: [],
  whiteList: [],
  botPace: {
    type: String,
    default: 'slow',
    enum: {
      values: ['slow', 'medium', 'fase'],
      message: 'bot pace most be "slow" , "mediume" , "fast".',
    },
  },
  followPrivate: {
    type: Boolean,
    default: false,
  },
  likeLastPost: {
    type: Boolean,
    default: true,
  },
  pageInfo: {},
  details: {},
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Bot = mongoose.model('Bot', BotSchema);

module.exports = Bot;
