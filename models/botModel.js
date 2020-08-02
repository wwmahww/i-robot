const mongoose = require('mongoose');
// const validator = require('validator');

const BotSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: [true, 'a bot most have a pagename'],
      unique: true,
      trim: true,
    },
    pagePassword: {
      type: String,
      required: [true, 'a bot most have a passsword'],
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
    discount: Number,
    refID: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties

BotSchema.virtual('daysLeft').get(function () {
  return Math.floor(this.timeLeft / (1000 * 60 * 60 * 24));
});

BotSchema.virtual('hoursLeft').get(function () {
  return Math.round((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
});

const Bot = mongoose.model('Bot', BotSchema);

module.exports = Bot;

// Query middleware
BotSchema.pre(/^find/, function (next) {
  this.populate({ path: 'bot', select: 'username' });
  next();
});
