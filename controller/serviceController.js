const Service = require('../models/serviceModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createService = catchAsync(async (req, res, next) => {
  console.log('in service controller');
  const service = await Service.create(req.body);

  res.status(201).json({
    status: 'success',
    service,
  });
});

exports.getAllServices = factory.getAll(Service);
exports.getService = factory.getOne(Service);
exports.deleteService = factory.deleteOne(Service);
exports.updateService = factory.updateOne(Service);
