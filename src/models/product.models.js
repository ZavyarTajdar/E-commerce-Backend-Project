import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
    },
    pictures: [
        { 
            type: String,
            required: true
        }
    ],
    video: {
        type: String
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    ratings: {
        average : {
            type : Number,
            default : 0
        },
        count : {
            type : Number,
            default : 0
        }
    }
},
    { timestamps: true }
)

ProductSchema.plugin(mongooseAggregatePaginate)

export const Product = mongoose.model("Product", ProductSchema);