const Discount = require('../models/discountModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createDiscount = catchAsync(async (req, res, next) => {
  const newDiscount = await Discount.create(req.body);

  res.status(200).json({
    status: 'success',
    newDiscount: newDiscount,
  });
});

exports.checkDiscount = catchAsync(async (req, res, next) => {
  console.log('hello every body');
  const { code, price } = req.body;
  console.log('price:', price);
  const discount = await Discount.findOne({ code });

  console.log(discount);

  if (!Discount) {
    return next(new AppError('this discount code does not exist.', 400));
  }
  // check discount expired time
  if (discount.expiredAt < Date.now()) {
    return next(new AppError('this discount is expired.', 400));
  }
  // Check if user is allowed to use the discount
  if (discount.blackList.includes(req.user.email)) {
    return next(new AppError('you can user this discount anymore.', 400));
  }
  const newPrice = (price * (100 - discount.percentage)) / 100;

  res.status(200).json({
    status: 'success',
    newPrice,
  });
});

exports.getDiscount = factory.getOne(Discount);
exports.getAllDiscounts = factory.getAll(Discount);
exports.deleteDiscount = factory.deleteOne(Discount);
exports.updateDiscount = factory.updateOne(Discount);
