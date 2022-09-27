const Account = require("../schema/account.schema");
const { ObjectId } = require("mongoose").Types;
const { JSONResponse } = require("../utilities/jsonResponse");
class AccountController{
    
    static createAccount = async (req, res, next)=>{
        try{
            let data = req.body;
            if(Object.keys(data).length == 0)throw new Error("No data was passed to create account");
            const account = new Account.create(data);
            JSONResponse.success(res,"Account was successfully created", account, 201);
        }catch(error){
            JSONResponse.error(res,"Error creating account", error, 400);
        }
    }

    static getAllAccounts = async(req, res, next)=>{
        try{
            let username = req.query.username;
            if(username){
                return this.getAccountsByUser(req, res, username);
            }
            let accounts = Account.find();
            JSONResponse.success(res,"Successfully Retrieved all accounts", accounts, 200);

        }catch(error){
            JSONResponse.error(res,"Error retrieving all accounts", error, 400);
        }
    }

    static updateAccount = async(req, res, next)=>{
        try{
            let data = req.body;
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error ("ID does not match any accounts in database")
            if(Object.keys(data).length == 0){
                return JSON.succes(res, "No data passed to update, file not updated",{}, 200);
            }
            let account = Account.findByIdAndUpdate(id, data, {new:true});
            JSONResponse.success(res, "Account information succesfully updated", account, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to update account",error, 400);
        }
    }

    static deleteAccount = async(req, res, next)=>{
        try{
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("ID does not match any accounts in database");
            let account = Account.findByIdAndDelete(id);
            JSONResponse.success(res, "Account information succesfully deleted", account, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to delete account", error, 400);
        }
    }

    static getAccountById = async(req, res, next)=>{
        try{
            let id = req.params.id;
            if(!ObjectId.isValid(id)) throw new Error("ID does not match any accounts in database");
            let account = Account.findById(id);
            JSONResponse.success(res, "Account information succesfully found", account, 200);
        }catch(error){
            JSONResponse.error(res, "Unable to find account", error, 400);
        }
    }

    static getAccountsByUser = async(req, res, queryParam)=>{
        try{
            let accounts = Account.find({username: queryParam});
            JSONResponse.success(res, "Accounts for user found", accounts, 200)
        }catch(error){
            JSONResponse.error(res, "Cannot find Accounts for user", error, 404);
        }
    } 
}

module.exports = AccountController;
