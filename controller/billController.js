const Bill = require('../models/billModel');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');
const Bot = require('../models/botModel');
const Discount = require('../models/discountModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const zarinpalCheckout = require('../zarinpal/zarinpal');
const { ready } = require('jquery');

const zarinpal = zarinpalCheckout.create(process.env.MERCHANT_CODE, true);

exports.pay = catchAsync(async (req, res, next) => {
  console.log('body:', req.query);
  const {
    query: { serviceCode, botPagename },
  } = req;
  let { offCode } = req.query;
  let bot = {};

  console.log(
    'code: ',
    serviceCode,
    'botPagename: ',
    botPagename,
    'offcode: ',
    offCode
  );
  if (botPagename) {
    bot = await Bot.findOne({ pageName: botPagename });
    req.user.services.find((serv) => {
      if (serv.refID === bot.refID) {
        offCode = serv.offCode;
      }
    });
  }
  console.log('offCOde: ', offCode);

  const service = await Service.findOne({ code: serviceCode });
  let { price } = service;

  // effect discount code
  const discount = await Discount.findOne({ code: offCode });
  console.log('discount: ', discount);
  console.log('include', discount.blackList.includes(req.user.email));
  console.log(
    'expired',
    discount.expiredAt ? discount.expiredAt > Date.now() : true
  );
  if (
    discount && discount.expiredAt
      ? discount.expiredAt > Date.now()
      : true && !discount.blackList.includes(req.user.email)
  ) {
    console.log('hear in discont');
    price = (price * (100 - discount.percentage)) / 100;
  }

  console.log('price: ', price);

  const params = {
    Amount: price,
    CallbackURL: `${req.protocol}://${req.get('host')}/payResult`,
    Description: `اکانت ${service.name}`,
    Email: 'i_robot.ir@yahoo.com',
    Mobile: '09154567375',
  };

  // Request for payment
  const session = await zarinpal.PaymentRequest(params);

  console.log('session:', session);

  if (session.status !== 100) {
    console.log('problem in payment');
    console.log('err: ', session.status);
    return next(new AppError('error in payment', 401));
  }

  // Create bill
  await Bill.create({
    authority: session.authority,
    service: service.name,
    userEmail: req.user.email,
    amount: service.price,
    finalPay: price,
    description: `اکانت ${service.name}`,
    offCode: offCode,
  });

  // bot extension
  if (botPagename) {
    console.log('Extension');
    await req.user.updateOne({ $set: { botExtension: bot._id } });
  }

  // Add service
  service.status = 'inpay';
  service.offCode = offCode;
  req.user.services.push(service);
  console.log('service: ', service);
  console.log('req.user.services: ', req.user.services);
  await req.user.updateOne({ $set: { services: req.user.services } });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.checkout = catchAsync(async (req, res, next) => {
  const {
    query: { Authority },
  } = req;

  //      Find bill-------------------------------------------------------------------------------------
  const bill = await Bill.findOne({ authority: Authority, isPayed: false });
  if (!bill) {
    req.query.Status = 'invalid';
    return next();
  }

  //      check for result----------------------------------------------------------------------------------
  const result = await zarinpal.PaymentVerification({
    Amount: bill.finalPay,
    Authority: Authority,
  });
  console.log('result: ', result);

  if (result.status !== 100) {
    await Bill.findByIdAndDelete(bill._id);
    const index = req.user.services.findIndex(
      (service) => service.status === 'inpay'
    );
    req.user.services.splice(index, 1);
    req.user.markModified('services');
    req.user.save({ validateBeforeSave: false });
    return next();
  }

  //      make change for a successfull pay------------------------------------------------------------------------
  const service = await Service.findOne({ name: bill.service });

  // Add 10% of the price to introducer------
  if (req.user.introducer) {
    const introducer = await User.findOne({ username: req.user.introducer });
    if (introducer) {
      const money = service.price / 10;
      console.log('money: ', money);
      await introducer.updateOne({ $inc: { credit: money } });
    }
  }

  //    update bot-----------------------------
  if (req.user.botExtension) {
    //   Extension-----------
    const { botExtension } = req.user;
    await Bot.updateOne(
      { _id: botExtension },
      {
        $inc: { timeLeft: service.timeLimit * 86400000 },
      }
    );
  } else {
    //  New service--------
    console.log('services', req.user.services);
    const service1 = req.user.services.find((serv) => serv.status === 'inpay');
    console.log('service1', service1);
    service1.status = 'ready';
    service1.refID = result.RefID;
    req.user.services.pop();
    req.user.services.push(service1);
  }

  //    update user-------------------------------------------
  req.user.bills.push(bill._id);
  await req.user.updateOne({
    $set: {
      bills: req.user.bills,
      botExtension: null,
      services: req.user.services,
      firstPurchase: false,
    },
  });

  //      update bill------------------------------------
  bill.refID = result.RefID;
  bill.isPayed = true;
  bill.payedAt = Date.now();
  bill.save({ validateBeforeSave: false });

  next();
});

exports.createBill = catchAsync(async (req, res, next) => {
  const newBill = Bill.create({
    user: req.user.id,
    amount: req.body.amount,
    description: req.body.description,
  });
});

exports.updateBill = catchAsync(async (req, res, next) => {
  const bill = Bill.findByIdAndUpdate(req.params.id, {
    payAt: Date.now(),
    isPayed: true,
  });
});

exports.myBills = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Bill.find({ user: req.user.id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const bills = await feature.query;

  res.status(200).json({
    status: 'success',
    data: bills,
  });
});

// exports.deleteBill = catchAsync(async (req, res, next) => {
//   console.log('we are in delete');
//   const bill = await Bill.findOneAndDelete({
//     _id: req.params.id,
//     isPayed: false,
//   });
//   console.log('bill: ', bill);
//   if (!bill) {
//     res.status(403).json({
//       status: 'faild',
//       message: 'you cant delete a bill that is payed!',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.deleteBill = factory.deleteOne(Bill);
exports.getAllBills = factory.getAll(Bill);
exports.getBill = factory.getOne(Bill);
