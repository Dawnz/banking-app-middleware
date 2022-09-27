const {model, Schema} = require("mongoose");

const accountSchema = new Schema({
    account_type : {
        type: String, 
        enum: {
        values: ["SAVINGS", "CHECKING"],
        message: "{VALUE} is not a correct account type, it should be either 'SAVINGS' or 'CHECKING'"
        }   
    },
    account_currency: {
        type: String, 
        max: [3, "The currency name should be 3 characters long"],
        min: [3, "The currency name should be 3 characters long"],
    },
    id_type: {
        type: String,
        required: [true, "Type of ID must be present in order to be valid"]
    },
    id_number: {
        type: String,
        required: [true, "ID must be present in order to be valid"]
    },
    address: {
        type:String,
        required: [true, "Address must be present in order to be valid"]
    },
    first_name:{
        type: String,
        required:[true, "No first name was provided"]
    },
    last_name:{
        type: String,
        required:[true, "No last name was provided"]
    },
    phone_number:{
        type: String,
        required:[true, "No phone number was provided"]
    },

});

module.exports = model("Account", accountSchema);