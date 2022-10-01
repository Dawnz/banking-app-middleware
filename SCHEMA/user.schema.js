const {model, Schema} = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * @openapi
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: mongoose object id as string
 *                  example: 63228ae60e8b432603389f39
 *              username:
 *                  type: string
 *                  example: jdoe65
 *              email:
 *                  type: string
 *                  example: jdoe65@mail.com
 *              password:
 *                  type: string
 *                  example: $3cUrePa$$0rd
 *              id_type:
 *                  type: string
 *                  example: Passport
 *              id_number:
 *                  type: string
 *                  example: A1234567
 *      
 * 
 */
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


// Middleware function to execute and hash password before saving user into the database.
userSchema.pre("save", async function(){
    this.password = await bcrypt.hash(this.password, 10);
})

// Instance method to check for a password to compare a password with the encrypted password on the instance document.
userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = model("User", userSchema);