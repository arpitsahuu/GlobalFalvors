var mongoose=require("mongoose");

let orderSchema=mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
        },    
        phoneNo:{
            type:Number,
        }
    },
    orderItems:[
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
            image:{
                type:String,
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product"
            }
        },
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    itemsPrice:{
        type:Number,
        default:0,
        required:true
    },
    textPrice:{
        type:Number,
        default:0,
        required:true
    },
    shippingPrice:{
        type:Number,
        default:60,
        required:true
    },
    totalPrice:{
        type:Number,
        default:0,
        required:true
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    orderId: {
		type: String,
	},
	receiptId: {
		type: String
	},
	paymentId: {
		type: String,
	},
	signature: {
		type: String,
	},
	amount: {
		type: Number
	},
	currency: {
		type: String
	},
	createdAt: {
		type: Date
	},
	status: {
		type: String
	}
},
{ timestamps: true }
);

const order = mongoose.model("Order",orderSchema);
module.exports = order;

 /*userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    productName:{
        type:String,
    },
    price:{
        type:Number
    },
    Quantity:{
        type:Number,
        default:0
    },
    Total:{
        type:Number,
        default:0
    }*/