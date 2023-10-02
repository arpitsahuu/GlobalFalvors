const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({

    name:String,
    tagline:String,
    Catimage: {
        type: String,
        default: "default.png",
    },
    types:{
        type:Array,
        default:[
            "Starters",
            "Main Course",
            "Desserts",
        ],
    },
    review:{
        type:Array,
        default:[],
    }
});




const categories = mongoose.model("categories", categoriesSchema );

module.exports = categories;