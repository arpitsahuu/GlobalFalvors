const mongoose = require("mongoose");
const plz = require("passport-local-mongoose");
const { array } = require("../helper/multer");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        uniqur: true,
    },
    contact:  {
        type:String,
        required:true,
        uniqur: true,
    },
    password: String,
    code: String,
    isAdmin:{
        type:Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "default.png",
    },
    card:{
        items:[
            {
                name:{
                    type:String,
                    required:true
                },
                price:{
                    type:Number,
                    required:true,
                    default:0
                },
                quantity:{
                    type:Number,
                    default:1
                },
                image:{
                    type:String,
                },
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"product"
                }
            },
        ]
    },
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"order"
        }

    ],
    address:{
        type:String
    },
    code:Number,
    passwordresttoken:String,
},
{ timestamps: true }
);

userSchema.plugin(plz);

const user = mongoose.model("user", userSchema);

module.exports = user;