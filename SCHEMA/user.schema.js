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
    isSuperAdmin:{
        type: Boolean,
        default: false,
    }
   

});


// Middleware function to execute and hash password before saving user into the database.
userSchema.pre("save", async function(){
    try{
        this.id_type = (this.id_type) ?this.id_type.toUpperCase():  undefined;
        this.password = await bcrypt.hash(this.password, 10);
        this.isSuperAdmin = false;
    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    
});






userSchema.post("save", async function(doc){
    doc = removeSensitiveFields(doc);
});

userSchema.post("findOneAndUpdate", async function(doc,next){    
    try{
    doc.id_type = (doc.id_type) ?doc.id_type.toUpperCase():  undefined;
    doc.password = await bcrypt.hash(doc.password, 10);
    doc = await doc.save();
    doc = removeSensitiveFields(doc)

    }catch(error){
        return Promise.reject(new Error(error.message));
    }
    next()
})


// had to do a bunch of acrobatics here. Not sure if it really is the best approach..highly doubt it. The latest condition is trying to zeroin on authenticating user to ensure that document password is not removed before it is processed;

userSchema.post(/^find/, async function(doc){
    if(Array.isArray(doc)){
        for(let file of doc){
            file = removeSensitiveFields(file);
        }
    }else {
        if(!doc) return Promise.reject(new Error("No File found"));
        if(!(this.op == "findOne" && this._conditions.username)) {
            doc = removeSensitiveFields(doc);
        }
    }
});


function removeSensitiveFields(doc){
    doc.isSuperAdmin = undefined;
    doc.password = undefined;   
    return doc
}
// Instance method to check for a password to compare a password with the encrypted password on the instance document.
userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = model("User", userSchema);