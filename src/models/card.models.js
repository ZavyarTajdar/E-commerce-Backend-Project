import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    categories: [
        {
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            link: {
                type: String
            }
        }
    ],
    bannerImage: {
        type: String
    },
    linkText: {
        type: String
    },
    linkUrl: {
        type: String
    }
}, { timestamps: true })


export const Card = mongoose.model("Card", CardSchema);