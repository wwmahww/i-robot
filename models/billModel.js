const mongoose = require('mongoose')

const BillSchema = new mongoose.Schema({
    code: {
        type: Number,
        default: 1000000 + Math.floor(Math.random() * 9000000 - 1000000)
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    amount: Number,
    description: String,
    createAt:{
        type:Date,
        default: Date.now(),
    },
    payAt: Date,
    isPayed: Boolean,
    offCode: String
})

const Bill = mongoose.model('Bill', BillSchema)
module.exports = Bill


BillSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: ['username', 'email']
    });
    next();
})