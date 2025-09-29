import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },   // e.g. "Size" or "Color"
    value: { type: String, required: true }   // e.g. "M", "Red"
}, { _id: false });

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
    sku: {
        type: String,
        unique: true,
        sparse: true   // allows products without SKU
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true
    },
    variants: [
        variantSchema
    ],
    isFeatured: {
        type: Boolean,
        default: false,
        index: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    }
},
    { timestamps: true }
)

ProductSchema.plugin(mongooseAggregatePaginate)

export const Product = mongoose.model("Product", ProductSchema);