const mongoose = require('mongoose');

const productScehma = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"You must enter a name of the product"],
        trim: true
    },
    description:{
        type: String,
        required: [true,"You must enter the description for the product"]
    },
    price:{
        type: Number,
        required: [true,"You must enter the price of the product"],
        maxLenght: [8 , "Price should be less than 10Cr. "]
    },
    ratings:{
        type:Number,
        default: 0
    },
    images:
    [
        // We are using cloud navi here so we need two things public_id and url
        //these two things should exactly have same definition
        //cloud navi is used to host images.
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true,"You must enter the category of the product"],
    },
    stock:{
        type: Number,
        required: [true, "You must enter the stock of the product"],
        maxLenght: [4, "Stock should be less than 10000"],
        default: 1
    },
    numOfReviews:{
        type: Number,
        default: 0,
    },   
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product",productScehma);