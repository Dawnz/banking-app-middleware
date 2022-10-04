const { model, Schema } = require("mongoose");

/**
 * @openapi
 * components:
 *  schemas:
 *      Account:
 *          type: object
 *          properties:
 *              id:
 *                  type: mongoose object id as string
 *                  example: 63228ae60e8b432603389f39
 *              account_type:
 *                  type: string
 *                  example: SAVINGS
 *              account_currency:
 *                  type: string
 *                  example: USD
 *              id_type:
 *                  type: string
 *                  example: Passport
 *              id_number:
 *                  type: string
 *                  example: A1234567
 *              address:
 *                  type: string
 *                  example: Suite B11, Pinnacle Pointe, 53 Lady Musgrave Rd, Kingston
 *              first_name:
 *                  type: string
 *                  example: John
 *              last_name:
 *                  type: string
 *                  example: Doe
 *              username:
 *                  type: string
 *                  example: jdoe95
 *              phone_number:
 *                  type: string
 *                  example: 876 354 7211
 *              account_balance:
 *                  type: number
 *                  example: 35,000
 *
 */
const { ObjectId } = require("mongoose").Types;
const Balance = require("../schema/balance.schema");
const accountSchema = new Schema(
   {
      account_type: {
         type: String,
         enum: {
            values: ["SAVING", "CHECKING"],
            message:
               "{VALUE} is not a correct account type, it should be either 'SAVINGS' or 'CHECKING'",
         },
         required: [true, "Please Enter an account type"],
         uppercase: true,
      },
      account_number: {
         type: String,
      },
      account_currency: {
         type: String,
         max: [3, "The currency name should be 3 characters long"],
         min: [3, "The currency name should be 3 characters long"],
         default: "JMD",
      },
      id_type: {
         type: String,
         required: [true, "Type of ID must be present in order to be valid"],
         enum: {
            values: ["NATIONAL", "PASSPORT", "LICENSE"],
            message:
               "{VALUE} is not valid, it should be either 'NATIONAL', 'PASSPORT', 'LICENSE'",
         },
         uppercase: true,
      },
      id_number: {
         type: String,
         required: [true, "ID must be present in order to be valid"],
         required: true,
      },
      address: {
         type: String,
         required: [true, "Address must be present in order to be valid"],
      },
      first_name: {
         type: String,
         required: [true, "No first name was provided"],
      },
      last_name: {
         type: String,
         required: [true, "No last name was provided"],
      },
      username: {
         type: String,
         required: [true, "Username must be present in order to be valid"],
      },
      phone_number: {
         type: String,
         required: [true, "No phone number was provided"],
      },
      account_balance: {
         type: Schema.Types.ObjectId,
         ref: "Balance",
      },
   },
   { timestamps: true }
);

// accountSchema.pre("save",function(next){
//     console.log("file is almost saved");
//     next()
// });

// Populated and used projection to only return the account_balance as well as the _id;
accountSchema.post("findOne", async function (doc) {
   if (doc) {
      await doc.populate("account_balance", { account_balance: 1, _id: 0 });
   }
});

const Account = model("Account", accountSchema);
module.exports = Account;
