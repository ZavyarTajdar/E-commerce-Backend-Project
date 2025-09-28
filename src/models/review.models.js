import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    }

},{timestamps : true})


export const Review = mongoose.model("Review", ReviewSchema);