const Transaction = require("../schema/transaction.schema");
const Account  = require("../schema/account.schema");
const { JSONResponse } = require("../utilities/jsonResponse");
const { ObjectId } = require("mongoose").Types;


class TransactionController {

    static createTransaction = async(req, res, next) =>{
        try{
            let data = req.body;
            let account_number = req.body;
            if(Object.keys(data).length == 0) throw new Error("No data passed to create transaction");
            let account = await Account.find({account_number: account_number})[0];

            if(!(data.transaction_type.toUpperCase() == "WITHDRAW" && this.isUserAccount(data, account))) throw new Error("User is unauthorized to make this transaction");

            this.make_transaction(data, account);
            let transaction = await Transaction.create(data);
            JSONResponse.success(res, "Successfully made transaction", transaction, 201 );
        }catch(error){
            JSONResponse.error(res, "An Error occured when making transaction", error, 404);
        }
    }

    /**
     * ### Description
     * Compares the names on the account and on the potential transation to see if the user owns the account.
     * @param {Transaction} data - Data passed in the body of the request which should be of type Transaction.
     * @param {Account} account - Data of account based on the account information that was retrieved from the database.
     * @returns 
     */
    static isUserAccount = async (data, account) =>{
        if(data.fname == account.first_name && data.lname == account.last_name){
            return true;
        }
        return false;
    }

        /**
     * ### Description
     * Checks to ensure that the transaction is valid in terms of calculations for withdrawal then uses account method to calculate balance of the account after transaction.
     * @param {Transaction} data - Data passed in the body of the request which should be of type Transaction.
     * @param {Account} account - Data of account based on the account information that was retrieved from the database.
     * @returns 
     */
    static makeTransaction = async(data, account)=>{
        let ammount = data.transaction_ammount;
        if(!ammount) throw new Error("No transaction ammount was given");
        if(account.account_balance < ammount && data.transaction_type == "WITHDRAW") throw new Error("Insufficient funds to complete transaction");
        
        await account.calculateBalance(data);
    }
}

module.exports = TransactionController;