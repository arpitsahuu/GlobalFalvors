const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    discription:{
        type:String,
        required:true,
    },
    rate:{
        type:Number,
        required:true,
    },
    rating:[{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
    image:{
        type:String,
        required:true,
    },
    ingredients:{
        type:String,
    },
    type:{
        type:String,
        required:true,
    },
    categorie:{
        type:String,
        required:true,
    }
    
});

const product = mongoose.model("product", productSchema );

module.exports = product;