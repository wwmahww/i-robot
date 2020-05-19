const genericPool = require('generic-pool');

const luncher = require('./pLuncher');

const opts = {
  max: 10, // maximum size of the pool
  min: 2, // minimum size of the pool
};

const factory = {
  create: async () => {
    return luncher;
  },
  destroy: async () => {},
};

const browserPool = genericPool.createPool(factory, opts);

module.exports = browserPool;
