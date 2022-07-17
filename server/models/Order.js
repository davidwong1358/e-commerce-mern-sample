const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userInfo: {
            username: { type: String },
            email: { type: String },
            _id: { type: String }
        },
        products: [],
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        payment: { type: String, required: true },
        cardNumber: { type: String },
        cardHolder: { type: String },
        expiryDate: { type: Date },
        cvv: { type: Number },
        notes: { type: String },
        total: { type: Number, required: true },
        status: { type: String, default: 'Pending' },
        message: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);