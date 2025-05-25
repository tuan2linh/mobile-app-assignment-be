const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    note: String,
    status: {
        type: String,
        enum: ["pending", "canceled", "confirm", "process", "leave"],
        default: "pending"
    },
    friendlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    foodItem: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            },
            quantity: Number,
            image: String,
            price: Number
        }
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    moneydeposit: {
        type: Number,
        default: 0
    },
    paystatus: {
        type: String,
        enum: ["unpaid", "deposit", "paid", "canceled"],
        default: "unpaid"
    },
    notefood: String
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
