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


    static getAllTransactions = async (req, res) => {
        try{
            if(req.query.account_id){
                return this.getAllAccountTransactions(req, res, next);
            }else{
               let transactions = await Transaction.find();
               JSONResponse.success(transactions, "Successfully retrieved all transactions", transactions, 200);
            }
        }catch(error){
            JSONResponse.success(res, "Unable to retrieve transactions", error, 404);
        }
    }

    static getAllAccountTransactions = async (req, res, next)=>{
        try{
            let {account_id} = req.query.account_id;
            if(account_id){
                let transactions = await Transaction.find({account_id: account_id});
                JSONResponse.success(res, "Successfully retrieved all transactions for account", transactions, 200);
            }
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve account transactions", error, 404);
        }
    }

    static getTransactionById = async (req, res, next)=>{
        try{
            let id = req.query.id;
            if(ObjectId.isValid(id)) throw new Error("Invalid ID for transaction, check the ID");
            let transaction = await Transaction.findById(id);
            JSONResponse.success(res, "Successfully retrieved transaction", transaction, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve transaction", error, 404);
        }
    }

    static updateTransactionStatus = async (req, res, next)=>{
        try{
            let id = req.query.id;
            let data = req.body;
            if(ObjectId.isValid(id)) throw new Error("Invalid ID for transcation, check the ID");
            if(Object.keys(data).length == 0) return JSONResponse.success(res,"No data passed to update the transaction, transaction not updated", data, 200);

            let transaction = await Transaction.findById(id);
            transaction.transaction_status = data.transaction_status;
            JSONResponse.success(res, "Successfully updated transaction", transaction, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update transaction", error,404);
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