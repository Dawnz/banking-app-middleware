const {model, Schema} = require("mongoose");
const bcrypt = require("bcrypt");


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
        required: [true, "Type of ID must be present in order to be valid"],
        enum: {
            values: ["NATIONAL", "PASSPORT", "LICENSE"],
            message: "{VALUE} is not valid, it should be either 'NATIONAL', 'PASSPORT', 'LICENSE'"
        },
    },
    id_number: {
        type: String,
        required: [true, "ID must be present in order to be valid"]
    },
   

});


// Middleware function to execute and hash password before saving user into the database.
userSchema.pre("save", async function(){
    this.id_type = this.id_type.toUpperCase();
    this.password = await bcrypt.hash(this.password, 10);
})

// Instance method to check for a password to compare a password with the encrypted password on the instance document.
userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = model("User", userSchema);