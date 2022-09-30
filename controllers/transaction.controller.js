const Transaction = require("../schema/transaction.schema");
const Account  = require("../schema/account.schema");
const Balance  = require("../schema/balance.schema");
const { JSONResponse } = require("../utilities/jsonResponse");
const { ObjectId } = require("mongoose").Types;


class TransactionController {

            /**
     *  ### Description
     * Creates a Transaction of either a withdrawal or a deposit.
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     * @returns 
     */
    static createTransaction = async(req, res, next) =>{
        try{
            let data = req.body;
            let account_number = req.body;
            data.transaction_type = data.transaction_type.toUpperCase();
            if(Object.keys(data).length == 0) throw new Error("No data passed to create transaction");
            let account = await Account.findOne({account_number: account_number});
            if(!account) throw new Error("No account found with this account number");
            if(!(data.transaction_type === "WITHDRAW" && this.isUserAccount(data, account))) throw new Error("User is unauthorized to make this transaction");
            let balance = this.getBalanceFromAccount(account.account_balance);
            this.makeTransaction(data, balance);
            let transaction = await Transaction.create(data);
            JSONResponse.success(res, "Successfully made transaction", transaction, 201 );
        }catch(error){
            JSONResponse.error(res, "An Error occured when making transaction", error, 404);
        }
    }

            /**
     *  ### Description
     * Retrieves all transactions from the database.
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     * @returns 
     */
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

            /**
     *  ### Description
     * Retrieves all Transactions of a user which matches the account id passed in the request's query parameters.
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     * @returns 
     */
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
        /**
     *  ### Description
     * Retrieves a transaction finding it by its ID.
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     * @returns 
     */
    static getTransactionById = async (req, res, next)=>{
        try{
            let id = req.query.id;
            if(ObjectId.isValid(id)) throw new Error("Invalid ID for transaction, check the ID");
            let transaction = await Transaction.findById(id);
            if(!transaction) throw new Error("No transaction found with that ID")
            JSONResponse.success(res, "Successfully retrieved transaction", transaction, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to retrieve transaction", error, 404);
        }
    }

    /**
     *  ### Description
     * Updated a transaction finding it by its ID. The function only facilitates updating the status of the transaction. 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     * @returns 
     */
    static updateTransactionStatus = async (req, res, next)=>{
        try{
            let id = req.query.id;
            let data = req.body;
            if(ObjectId.isValid(id)) throw new Error("Invalid ID for transcation, check the ID");
            if(Object.keys(data).length == 0) return JSONResponse.success(res,"No data passed to update the transaction, transaction not updated", data, 200);

            let transaction = await Transaction.findById(id);
            if(!transaction) throw new Error("No transaction found with that ID")

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
    static makeTransaction = async(data, balance)=>{
        try{


        let ammount = data.transaction_ammount;
        if(!ammount) throw new Error("No transaction ammount was given");
        if(balance.account_balance < ammount && data.transaction_type == "WITHDRAW") throw new Error("Insufficient funds to complete transaction");
        
        await balance.calculateBalance(data);
        
        }catch(error){
            throw new Error(error);
        }
    }


    /**
     * ### Description
     * Returns a balance document which matches the id of the one passed in as parameter to the function.
     * @param {string} balance_id This represents an objectId that is referenced from the account schema
     * @returns {Balance}
     */
    static getBalanceFromAccount = async(balance_id)=>{
        try{
            let balance = await Balance.findById(balance_id);
            if(!balance) throw new Error("Unable to retrieve balance from this account");
            return balance;
        }catch(error){
            throw new Error(error)
        }

    }
}

module.exports = TransactionController;