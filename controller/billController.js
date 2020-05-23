const Bill = require('./../models/billModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


exports.createBill = catchAsync(async (req,res,next) => {
    const newBill = Bill.create({
        user:req.user.id,
        amount: req.body.amount,
        description: req.body.description
    })
})

exports.updateBill = catchAsync(async (req, res, next) => {
    const bill = Bill.findByIdAndUpdate(req.params.id, {payAt:new Date.now(), isPayed: true})
})


exports.myBills = catchAsync( async(req, res, next) => {
    const feature = new APIFeatures(Bill.find({user: req.user.id}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const bills = await feature.query;

    res.status(200).json({
        status: 'success',
        data: bills
    });
});

exports.getAllBills = factory.getAll(Bill);
exports.getBill = factory.getOne(Bill);
exports.deleteBill = () => {
    const bill = Bill.find({id})
    if(!bill.idPayed)
        factory.deleteOne(Bill);
    res.status(403).json({
        status:'faild',
        message: 'you cant delete a bill that is payed!'
    })
} 