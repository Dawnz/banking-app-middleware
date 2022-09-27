const {model, Schema} = require("mongoose");

const userSchema = new Schema({
    username : {
        type: String, 
        unique: [true, "Username already exist in the database"]
    },
    email: {
        type: String, 
        unique: [true, "Email already exist in the database"]
    },
    password: {
        type: String, 
        required: [true, "Password was not provided"]
    }, 
    id_type: {
        type: String,
        required: [true, "Type of ID must be present in order to be valid"]
    },
    id_number: {
        type: String,
        required: [true, "ID must be present in order to be valid"]
    },
   

});

module.exports = model("User", userSchema);