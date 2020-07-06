const mongoose = require('mongoose');
// const validator = require('validator');

const BotSchema = new mongoose.Schema({
  pageName: {
    type: String,
    unique: true,
    trim: true,
  },
  pagePassword: {
    type: String,
    trim: true,
  },
  owner: {
    type: String,
    required: [true, ' A bot most have an owner'],
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
  timeLeft: {
    type: Number,
    default: 0,
  },
});

const Bot = mongoose.model('Bot', BotSchema);

module.exports = Bot;

// Query middleware
BotSchema.pre(/^find/, function (next) {
  this.populate({ path: 'bot', select: 'username' });
  next();
});
