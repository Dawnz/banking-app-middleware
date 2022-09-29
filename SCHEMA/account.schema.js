const {model, Schema} = require("mongoose");
const { randomNumberGenerator } = require("../utilities/randomNumbersGenerator");


const accountSchema = new Schema({
    account_type : {
        type: String, 
        enum: {
        values: ["SAVINGS", "CHECKING"],
        message: "{VALUE} is not a correct account type, it should be either 'SAVINGS' or 'CHECKING'"
        }   
    },
    account_number: {
        type: String,
    },
    account_currency: {
        type: String, 
        max: [3, "The currency name should be 3 characters long"],
        min: [3, "The currency name should be 3 characters long"],
    },
    id_type: {
        type: String,
        required: [true, "Type of ID must be present in order to be valid"],
        enum: {
            values: ["NATIONAL", "PASSPORT", "DRIVER"],
            message: "{VALUE} is not valid, it should be either 'NATIONAL', 'PASSPORT', 'DRIVER'"
        },
        uppercase: true,
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
    username: {
        type: String, 
        required: [true, "Username must be present in order to be valid"],
    },
    phone_number:{
        type: String,
        required:[true, "No phone number was provided"]
    },
    account_balance: {
        type: Schema.Types.ObjectId,
        ref: "Balance",
        
    }

});
const Account = model("Account", accountSchema);
module.exports = Account;


/**
 * ### Description
 * This schema static method compares an accountNumber passed in to all the accounts in the database. If there is an account with that number, it will return false. Otherwise, it will return true.
 * @param {string} accountNumber 
 * @returns {boolean}
 */
accountSchema.statics.compareAccountNumbers = async function(accountNumber){
    const Account = this;
    const accounts =  await Account.find({account_number: accountNumber});
    if(accounts.length > 0){
        return false;
    }
    return true;

}

/**
 * ### Description
 * This Middleware will run after an account have been saved. Its purpose is to asign an account number to the document.
 */
accountSchema.post('save', async function(doc){
    let prefix = doc._id.toString().slice(0, 3);
    let accountNumber = randomNumberGenerator(prefix, 8);
    while(true){
        if(await Account.compareAccountNumbers(accountNumber)){
            doc.account_number = accountNumber;
            break;
        }
    }
    return;

})

