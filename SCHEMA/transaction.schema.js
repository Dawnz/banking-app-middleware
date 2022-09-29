const {model, Schema} = require("mongoose");

const transactionSchema = new Schema({
    transaction_type:{
        type: String, 
        enum: {
        values: ["WITHDRAW", "DEPOSIT"],
        message: "{VALUE} is not a correct transaction type, it should be either 'WITHDRAW' or 'DEPOSIT'"
    }}, 
    transaction_amount:{
        type: Number, 
        required: [true, "Cannot make a transaction without an ammount"]
    },
    name_on_transaction:{
        type: String,
        required:[true, "A name must be provided"]
    },
    transaction_status:{
        type: String,
        enum:{
            values: ["PENDING", "RESCHEDULED", "PAID", "REFUNDED", "CANCELLED", "REFUND PENDING" ],
            message: "{VALUE} is not a valid transaction status"
        },
        default: "PENDING",
    }
}, {timestamps:true});


module.exports = model("Transaction", transactionSchema);