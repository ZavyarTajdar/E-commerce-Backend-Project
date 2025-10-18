import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    street: {
        type: String 
    },
    city: { 
        type: String 
    },
    state: { 
        type: String 
    },
    postalCode: { 
        type: Number 
    },
    country: {
        type: String, 
        default: "Pakistan" 
    },
    type: { 
        type: String, 
        enum: ["home", "office"], 
        default: "home" 
    }
},{timestamps : true})


export const Address = mongoose.model("Address", AddressSchema );